import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                <AvatarFallback>{user.user_metadata.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.user_metadata.full_name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Account created</p>
              <p>{format(new Date(user.created_at), 'PPP')}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Last sign in</p>
              <p>{format(new Date(user.last_sign_in_at ?? new Date()), 'PPP')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 