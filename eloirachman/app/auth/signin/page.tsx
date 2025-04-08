"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    phoneNumber: '',
    fullName: ''
  })
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: {
            company_name: formData.companyName,
            phone: formData.phoneNumber,
            full_name: formData.fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setMagicLinkSent(true)
      toast({
        title: "Magic Link Sent",
        description: "Check your email for a sign-in link.",
      })
    } catch (error: any) {
      console.error('Magic link error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send magic link. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a magic link to {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Click the link in your email to sign in automatically. No password needed!
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see the email, check your spam folder or request a new link.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setMagicLinkSent(false)}>
              Back
            </Button>
            <Button variant="ghost" onClick={(e) => handleSignIn(e as any)}>
              Resend Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In or Register</CardTitle>
          <CardDescription>
            Enter your details to access your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <Separator className="my-4"/>
            <p className="text-sm text-muted-foreground">
              The fields below are optional for existing users but required for new accounts
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                autoComplete="organization"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              We'll email you a magic link to sign in securely
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 