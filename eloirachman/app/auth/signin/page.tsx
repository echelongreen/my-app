"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full"
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 