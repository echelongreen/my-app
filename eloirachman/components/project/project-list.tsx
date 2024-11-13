"use client";

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card 
          key={project.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
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
        </Card>
      ))}
    </div>
  )
} 