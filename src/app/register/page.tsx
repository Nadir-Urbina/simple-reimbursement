"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function RegisterContent() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to organization registration
    const timer = setTimeout(() => {
      router.push("/register/organization")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to SimpleReimbursement</CardTitle>
        <CardDescription>
          You're being redirected to the organization setup page...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      }>
        <RegisterContent />
      </Suspense>
    </div>
  )
}

