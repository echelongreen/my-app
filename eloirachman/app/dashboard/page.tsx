import { createClient } from '@/lib/supabase/server'
import { CreateProjectButton } from '@/components/project/create-project-button'
import { getProjects } from '@/app/actions/projects'

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <CreateProjectButton />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <div key={project.id} className="p-4 border rounded-lg">
            <h2 className="font-semibold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
} 