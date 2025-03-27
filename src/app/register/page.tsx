"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()

  // Redirect to organization registration
  useEffect(() => {
    router.push("/register/organization")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Redirecting...</CardTitle>
          <CardDescription>
            Setting up SimpleReimbursement for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center py-8">
          <p>SimpleReimbursement is designed for organizations. You'll be redirected to the organization setup page.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={() => router.push("/register/organization")} 
            className="w-full"
          >
            Continue to Organization Setup
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

