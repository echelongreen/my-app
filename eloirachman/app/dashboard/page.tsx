import { createClient } from '@/lib/supabase/server'
import { CreateProjectButton } from '@/components/project/create-project-button'
import { ProjectList } from '@/components/project/project-list'
import { getProjects } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import Link from 'next/link'

type Company = {
  id: string
  name: string
  logo_url: string | null
  primary_color: string
}

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get user's company
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company:company_id(*)')
    .eq('user_id', user.id)
    .single()

  const company = companyUser?.company as Company | undefined
  const projects = await getProjects()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {company?.name ? `${company.name}'s Projects` : 'My Projects'}
          </h1>
          <p className="text-gray-500">Manage and track your projects</p>
        </div>
        <div className="flex gap-4">
          <Link href="/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <CreateProjectButton />
        </div>
      </div>
      
      <ProjectList projects={projects || []} />
    </main>
  )
} 