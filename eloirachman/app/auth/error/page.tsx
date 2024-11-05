"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "Unknown";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            {error === "AccessDenied"
              ? "You do not have permission to sign in."
              : "There was an error signing in."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-600">
          {error === "AccessDenied" ? (
            <p>Please make sure you are using the correct account.</p>
          ) : (
            <p>Please try again or contact support if the problem persists.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/signin">
            <Button variant="outline">Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 