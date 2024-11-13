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

export async function createProject(data: ProjectFormData) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { error } = await supabase.from('projects').insert({
      name: data.name,
      description: data.description,
      start_date: data.startDate?.toISOString(),
      end_date: data.endDate?.toISOString(),
      user_id: user.id
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
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
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