'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type TaskFormData = {
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: Date
  projectId: string
}

export async function createTask(data: TaskFormData) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { error } = await supabase.from('tasks').insert({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      due_date: data.dueDate?.toISOString(),
      project_id: data.projectId,
      user_id: user.id
    })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    revalidatePath(`/projects/${data.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function getTasks(projectId: string) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
} 