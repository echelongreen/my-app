'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export type ProjectFormData = {
  name: string
  description?: string
  startDate?: Date
  endDate?: Date
}

export type ProjectUpdateData = {
  id: string
  name: string
  description?: string | null
  startDate?: Date
  endDate?: Date
}

export async function createProject(data: ProjectFormData) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // Get user's company
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!companyUser) throw new Error('No company found')

  try {
    const { error } = await supabase.from('projects').insert({
      name: data.name,
      description: data.description,
      start_date: data.startDate?.toISOString(),
      end_date: data.endDate?.toISOString(),
      company_id: companyUser.company_id,
      created_by: user.id
    })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getProjects() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get user's company
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!companyUser) return null

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('company_id', companyUser.company_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return null
  }

  return projects
}

export async function getProject(projectId: string) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function updateProject(data: ProjectUpdateData) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        name: data.name,
        description: data.description,
        start_date: data.startDate?.toISOString(),
        end_date: data.endDate?.toISOString(),
      })
      .eq('id', data.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    revalidatePath(`/projects/${data.id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's company
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!companyUser) throw new Error('No company found')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('company_id', companyUser.company_id)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }

  revalidatePath('/dashboard')
}