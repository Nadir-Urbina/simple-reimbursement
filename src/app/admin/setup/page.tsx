'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type SetupStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function AdminSetupPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add your personal details and preferences',
      completed: false,
    },
    {
      id: 'company',
      title: 'Configure company settings',
      description: 'Add company details, logo, and expense categories',
      completed: false,
    },
    {
      id: 'invite',
      title: 'Invite team members',
      description: 'Invite employees and other admins to your organization',
      completed: false,
    },
    {
      id: 'approval',
      title: 'Set up approval workflows',
      description: 'Configure expense approval rules and limits',
      completed: false,
    },
  ]);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepClick = (stepId: string) => {
    // For now, we'll just mark the step as completed for demo purposes
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Organization Setup</h1>
          <p className="text-muted-foreground mt-2">
            Complete these steps to get your organization ready for expense management
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Setup progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map(step => (
            <Card key={step.id} className={step.completed ? "border-green-200 bg-green-50/50 dark:bg-green-950/10" : ""}>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => handleStepClick(step.id)}
                  className="w-full"
                  variant={step.completed ? "outline" : "default"}
                >
                  {step.completed ? "Completed" : "Start"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => router.push('/admin/dashboard')}
            variant="outline"
            className="mr-2"
          >
            Skip for now
          </Button>
          <Button
            onClick={() => router.push('/admin/dashboard')}
            disabled={completedSteps < steps.length}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
} 