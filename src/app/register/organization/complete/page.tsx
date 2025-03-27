"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Extract the component that uses useSearchParams into a separate client component
function OrganizationCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationName = searchParams.get("name") || "your organization";
  const email = searchParams.get("email") || "the admin email";

  useEffect(() => {
    // The admin will need to check their email for the temporary password
    // This page is just a confirmation that the organization has been created
  }, []);

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Organization Created!</CardTitle>
          <CardDescription>
            {organizationName} has been successfully registered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              We've sent an email to <strong>{email}</strong> with instructions on how to access your admin account.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>What happens next:</p>
            <ol className="list-decimal ml-4 mt-2 space-y-1">
              <li>Check your email for your temporary password</li>
              <li>Login to your admin account</li>
              <li>Complete your organization setup</li>
              <li>Invite team members to join</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/admin/setup")}>
            Continue to Admin Setup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main page component with Suspense boundary
export default function OrganizationCompletePage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <OrganizationCompleteContent />
    </Suspense>
  );
} 