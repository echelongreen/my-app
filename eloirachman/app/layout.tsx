import SupabaseProvider from '@/components/providers/supabase-provider'
import { Toaster } from '@/components/ui/toaster'
import { NavBar } from '@/components/navigation/nav-bar'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {user && <NavBar user={user} />}
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
