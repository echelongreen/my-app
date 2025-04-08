"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Company = {
  id: string
  name: string
  logo_url: string | null
  primary_color: string
}

type CompanyUser = {
  id: string
  user_id: string
  email: string
  role: 'admin' | 'manager' | 'member'
  status: 'active' | 'pending'
}

export default function Settings() {
  const [company, setCompany] = useState<Company | null>(null)
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'manager' | 'member'>('member')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      // Get company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .single()

      if (companyError) throw companyError
      setCompany(companyData)

      // Get company users
      const { data: usersData, error: usersError } = await supabase
        .from('company_users')
        .select(`
          id,
          user_id,
          role,
          status,
          user:user_id (
            email
          )
        `)

      if (usersError) throw usersError
      setUsers(usersData.map(u => ({
        id: u.id,
        user_id: u.user_id,
        email: u.user.email,
        role: u.role,
        status: u.status
      })))
    } catch (error: any) {
      console.error('Error loading company data:', error)
      toast({
        title: "Error",
        description: "Failed to load company data",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          primary_color: company.primary_color
        })
        .eq('id', company.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Company settings updated successfully",
      })
    } catch (error: any) {
      console.error('Error updating company:', error)
      toast({
        title: "Error",
        description: "Failed to update company settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    try {
      setLoading(true)
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', inviteEmail)
        .single()

      let userId = existingUser?.id

      // If user doesn't exist, create them
      if (!userId) {
        const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
          email: inviteEmail,
          password: Math.random().toString(36).slice(-8), // Generate random password
          email_confirm: true
        })
        if (signUpError) throw signUpError
        userId = newUser.user.id
      }

      // Add user to company
      const { error: inviteError } = await supabase
        .from('company_users')
        .insert([
          {
            company_id: company.id,
            user_id: userId,
            role: inviteRole,
            status: 'pending'
          }
        ])

      if (inviteError) throw inviteError

      toast({
        title: "Success",
        description: "User invited successfully",
      })

      setInviteEmail('')
      loadCompanyData()
    } catch (error: any) {
      console.error('Error inviting user:', error)
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'manager' | 'member') => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('company_users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User role updated successfully",
      })

      loadCompanyData()
    } catch (error: any) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User removed successfully",
      })

      loadCompanyData()
    } catch (error: any) {
      console.error('Error removing user:', error)
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!company) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Company Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update your company information and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Primary Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={company.primary_color}
                    onChange={(e) => setCompany({ ...company, primary_color: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Invite and manage users in your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteUser} className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="inviteEmail">Email</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email to invite"
                      required
                    />
                  </div>
                  <div className="w-40">
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select value={inviteRole} onValueChange={(value: 'manager' | 'member') => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Inviting..." : "Invite"}
                    </Button>
                  </div>
                </div>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: 'admin' | 'manager' | 'member') => 
                            handleUpdateUserRole(user.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 