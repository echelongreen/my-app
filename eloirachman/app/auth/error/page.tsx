"use client";

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-4 px-4 text-center">
        <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-gray-600">
          There was a problem signing you in. Please try again.
        </p>
        <Button onClick={() => router.push('/auth/signin')}>
          Back to Sign In
        </Button>
      </div>
    </div>
  )
} 