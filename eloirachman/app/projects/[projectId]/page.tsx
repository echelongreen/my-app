import { getProject } from '@/app/actions/projects'
import { getTasks } from '@/app/actions/tasks'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Clock, ArrowLeft, File } from 'lucide-react'
import { CreateTaskButton } from '@/components/task/create-task-button'
import { TaskList } from '@/components/task/task-list'
import { EditProjectForm } from '@/components/project/edit-project-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file/file-upload'
import { getProjectFiles } from '@/app/actions/files'

export default async function ProjectPage({
  params: { projectId },
}: {
  params: { projectId: string }
}) {
  const [project, tasks, files] = await Promise.all([
    getProject(projectId),
    getTasks(projectId),
    getProjectFiles(projectId)
  ])

  if (!project) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <EditProjectForm project={project} />
        </div>

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Documents</h2>
            </div>
            <FileUpload projectId={projectId} />
            {files.length > 0 ? (
              <div className="mt-4 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No documents uploaded</p>
            )}
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