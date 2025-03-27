"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

// Login form component that uses useSearchParams
function LoginFormContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, signInWithLink, isLoading } = useAuth()
  
  const searchParams = useSearchParams()
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [emailForSignIn, setEmailForSignIn] = useState("")
  
  useEffect(() => {
    // Retrieve email for sign-in when the page loads
    const email = localStorage.getItem("emailForSignIn")
    if (email) {
      setEmailForSignIn(email)
    }
    
    // Check if this is a sign-in with email link
    if (window.location.href.includes("apiKey") && email) {
      completeSignInWithEmail(email)
    }
  }, [])
  
  const completeSignInWithEmail = async (email: string) => {
    try {
      await signInWithLink(email)
      localStorage.removeItem("emailForSignIn")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in with link:", error)
      toast({
        title: "Error",
        description: "Failed to sign in with email link. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    try {
      await signIn(values.email, values.password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = (e.target as HTMLFormElement).email.value
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }
    
    try {
      await signInWithLink(email)
      localStorage.setItem("emailForSignIn", email)
      setMagicLinkSent(true)
    } catch (error) {
      console.error("Error sending magic link:", error)
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email & Password</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="magic">
            {magicLinkSent ? (
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  <p>Magic link sent to <strong>{emailForSignIn}</strong>!</p>
                  <p className="mt-2">Check your email and click the link to sign in.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMagicLinkSent(false)}
                >
                  Send New Link
                </Button>
              </div>
            ) : (
              <form onSubmit={handleMagicLinkSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email">Email</Label>
                  <Input
                    id="magic-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    defaultValue={emailForSignIn}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending link..." : "Send Magic Link"}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

