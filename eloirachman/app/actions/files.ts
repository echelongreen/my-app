'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { openai } from '@/lib/openai'

type FileData = {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export async function uploadFile({
  fileData,
  projectId,
  text,
}: {
  fileData: FileData
  projectId: string
  text: string
}) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    // 1. Convert base64 to Buffer
    const buffer = Buffer.from(fileData.base64, 'base64')

    // 2. Create a safe filename
    const timestamp = Date.now()
    const safeName = fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${safeName}`
    const filePath = `${projectId}/${fileName}`

    // 3. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: fileData.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      throw uploadError
    }

    // 4. Generate embeddings
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text.slice(0, 8000), // OpenAI has a token limit
      });

      // 5. Store file metadata and embedding in database
      const { data: fileData2, error: insertError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          user_id: user.id,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          content: text,
          embedding: embedding.data[0].embedding,
          storage_key: filePath,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Database error:', insertError)
        throw insertError
      }

      revalidatePath(`/projects/${projectId}`)
      return { success: true, file: fileData2 }
    } catch (embeddingError) {
      console.error('OpenAI error:', embeddingError)
      // If embedding fails, still save the document without embedding
      const { data: fileData2, error: insertError } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          user_id: user.id,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          content: text,
          storage_key: filePath,
        })
        .select()
        .single()

      if (insertError) throw insertError

      revalidatePath(`/projects/${projectId}`)
      return { success: true, file: fileData2 }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function getProjectFiles(projectId: string) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    // Add cache control headers to prevent caching
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .throwOnError() // This will throw on any error
      .abortSignal(new AbortController().signal) // This helps prevent caching

    if (error) throw error

    // Double-check that we're not returning deleted files
    const { data: existingFiles, error: storageError } = await supabase.storage
      .from('documents')
      .list(`${projectId}`)

    if (storageError) throw storageError

    // Only return files that still exist in storage
    const existingFileNames = new Set(existingFiles.map(f => f.name))
    const validFiles = data.filter(file => {
      const fileName = file.storage_key.split('/').pop()
      return existingFileNames.has(fileName)
    })

    return validFiles
  } catch (error) {
    console.error('Error fetching files:', error)
    throw error
  }
}

export async function getFileUrl(path: string) {
  const supabase = createClient()
  
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(path)

  return publicUrl
}

export async function downloadFile(fileId: string) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    // First get the file metadata
    const { data: file, error: fileError } = await supabase
      .from('documents')
      .select('storage_key')
      .eq('id', fileId)
      .single()

    if (fileError) throw fileError

    // Then get the download URL
    const { data, error: downloadError } = await supabase.storage
      .from('documents')
      .createSignedUrl(file.storage_key, 60) // URL valid for 60 seconds

    if (downloadError) throw downloadError

    return data.signedUrl
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

export async function deleteFile(fileId: string, projectId: string) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    // First get the file metadata
    const { data: file, error: fileError } = await supabase
      .from('documents')
      .select('storage_key')
      .eq('id', fileId)
      .single()

    if (fileError) throw fileError

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([file.storage_key])

    if (storageError) throw storageError

    // Delete from database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', fileId)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    // Add multiple revalidation paths
    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/dashboard')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
} 