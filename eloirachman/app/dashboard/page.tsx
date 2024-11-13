import { createClient } from '@/lib/supabase/server'
import { CreateProjectButton } from '@/components/project/create-project-button'
import { ProjectList } from '@/components/project/project-list'
import { getProjects } from '@/app/actions/projects'

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-gray-500">Manage and track your projects</p>
        </div>
        <CreateProjectButton />
      </div>
      
      <ProjectList projects={projects || []} />
    </main>
  )
} 