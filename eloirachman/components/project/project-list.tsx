"use client";

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProject } from '@/app/actions/projects'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Project = {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  company_id: string
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleDelete = async (projectId: string) => {
    try {
      setDeletingId(projectId)
      await deleteProject(projectId)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
    } catch (error: any) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card 
          key={project.id}
          className="group relative cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-500">
              {project.start_date && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Starts: {format(new Date(project.start_date), 'PPP')}</span>
                </div>
              )}
              {project.end_date && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Due: {format(new Date(project.end_date), 'PPP')}</span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(project.id)
              }}
              disabled={deletingId === project.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 