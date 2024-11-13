import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

async function getProject(projectId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ProjectPage({
  params: { projectId }
}: {
  params: { projectId: string }
}) {
  const project = await getProject(projectId)
  if (!project) notFound()

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-500">{project.description}</p>
        </div>
        
        {/* Tabs for different sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tasks Section - To be implemented */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Tasks</h2>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>

          {/* Documents Section - To be implemented */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Documents</h2>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>

          {/* Chat Section - To be implemented */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Chat</h2>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
} 