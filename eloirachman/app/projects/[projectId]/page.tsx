import { getProject } from '@/app/actions/projects'
import { getTasks } from '@/app/actions/tasks'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import { CreateTaskButton } from '@/components/task/create-task-button'
import { TaskList } from '@/components/task/task-list'

export default async function ProjectPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getTasks(projectId)
  ])

  if (!project) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600 mb-6">{project.description}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {project.start_date && (
            <div className="flex items-center p-4 bg-white rounded-lg shadow">
              <Calendar className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">
                  {format(new Date(project.start_date), 'PPP')}
                </p>
              </div>
            </div>
          )}
          {project.end_date && (
            <div className="flex items-center p-4 bg-white rounded-lg shadow">
              <Clock className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">
                  {format(new Date(project.end_date), 'PPP')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <CreateTaskButton projectId={projectId} />
            </div>
            {tasks.length > 0 ? (
              <TaskList tasks={tasks} />
            ) : (
              <p className="text-gray-500">No tasks yet</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <p className="text-gray-500">No documents uploaded</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <p className="text-gray-500">Chat functionality coming soon</p>
          </section>
        </div>
      </div>
    </main>
  )
} 