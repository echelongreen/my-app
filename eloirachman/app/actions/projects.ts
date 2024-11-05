'use server'

import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  start_date: z.date(),
  end_date: z.date(),
  user_id: z.string(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export async function createProject(data: ProjectFormData) {
  try {
    const validatedData = projectSchema.parse({
      ...data,
      // Convert Date objects to ISO strings for Supabase
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    });

    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert([
        {
          ...validatedData,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function getProjects(userId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProject(projectId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
} 