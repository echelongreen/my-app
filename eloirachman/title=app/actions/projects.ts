'use server'

import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from '@/lib/supabase/server'

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  user_id: z.string().uuid(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export async function createProject(data: ProjectFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  const supabase = createClient()
  
  try {
    const { error } = await supabase.from('projects').insert({
      name: data.name,
      description: data.description,
      start_date: data.startDate?.toISOString(),
      end_date: data.endDate?.toISOString(),
      user_id: session.user.id
    })
    console.error('Error creating project:', error)
    if (error) throw error
  }
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
} 