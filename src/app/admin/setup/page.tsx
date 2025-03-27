"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronRight, Loader2, MailPlus, Settings, Users, FileCheck } from "lucide-react"

type SetupStep = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

function AdminSetupContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "profile",
      title: "Complete your profile",
      description: "Set up your admin profile and preferences",
      icon: <Settings className="h-5 w-5" />,
      completed: false
    },
    {
      id: "company",
      title: "Configure company settings",
      description: "Add company details and customize your organization",
      icon: <Settings className="h-5 w-5" />,
      completed: false
    },
    {
      id: "invite",
      title: "Invite team members",
      description: "Add users to your organization",
      icon: <MailPlus className="h-5 w-5" />,
      completed: false
    },
    {
      id: "workflow",
      title: "Set up approval workflows",
      description: "Configure expense approval process",
      icon: <FileCheck className="h-5 w-5" />,
      completed: false
    },
  ])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !loading) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [user, router, loading])

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.completed).length
  const progressPercentage = Math.round((completedSteps / steps.length) * 100)

  const handleStepClick = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ))
  }

  const handleContinue = () => {
    router.push('/admin/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Set Up Your Organization</CardTitle>
          <CardDescription>
            Complete these steps to set up your organization in SimpleReimbursement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Setup Progress</div>
              <div className="text-sm font-medium">{progressPercentage}% Complete</div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.id} className={`cursor-pointer transition-all ${
            step.completed ? 'border-green-200 bg-green-50/50' : ''
          }`}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-xl">
                  {step.title}
                  {step.completed && (
                    <CheckCircle2 className="ml-2 inline-block h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                {step.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {step.completed ? 
                  "Completed" : 
                  "Not started yet"
                }
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={step.completed ? "outline" : "default"} 
                className="w-full" 
                onClick={() => handleStepClick(step.id)}
              >
                {step.completed ? "Mark as Incomplete" : "Start"}
                {!step.completed && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
          Skip for now
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={progressPercentage < 100}
        >
          {progressPercentage < 100 ? 
            "Complete All Steps to Continue" : 
            "Continue to Dashboard"
          }
        </Button>
      </div>
    </div>
  )
}

export default function AdminSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AdminSetupContent />
    </Suspense>
  )
} 