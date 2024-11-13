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
  assigneeId?: string
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
      user_id: user.id,
      assignee_id: data.assigneeId,
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
    // First get the tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (tasksError) throw tasksError;

    // Then get the assignee details for each task
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        if (!task.assignee_id) return { ...task, assignee: null };

        const { data: assignee, error: assigneeError } = await supabase
          .from('users')
          .select('id, email, raw_user_meta_data')
          .eq('id', task.assignee_id)
          .single();

        if (assigneeError) {
          console.error('Error fetching assignee:', assigneeError);
          return { ...task, assignee: null };
        }

        return {
          ...task,
          assignee: assignee
        };
      })
    );
    
    return tasksWithAssignees;
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

type TaskUpdateData = {
  id: string
  title?: string
  description?: string | null
  status?: string
  priority?: string
  dueDate?: Date
  assigneeId?: string
}

export async function updateTask(data: TaskUpdateData) {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate && { due_date: data.dueDate.toISOString() }),
        ...(data.assigneeId !== undefined && { assignee_id: data.assigneeId }),
      })
      .eq('id', data.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    revalidatePath('/projects/[projectId]')
    return { success: true }
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
} 