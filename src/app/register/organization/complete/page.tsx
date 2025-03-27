'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';

export default function OrganizationCompleteComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing');

  useEffect(() => {
    const setupIntentId = searchParams.get('setup_intent');
    const setupIntentClientSecret = searchParams.get('setup_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');

    if (redirect_status === 'succeeded') {
      setStatus('success');
    } else if (setupIntentId && setupIntentClientSecret) {
      // Validate the setup intent with your backend
      validateSetupIntent(setupIntentId, setupIntentClientSecret);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const validateSetupIntent = async (setupIntentId: string, clientSecret: string) => {
    try {
      const response = await fetch('/api/payment/validate-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setupIntentId,
          clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate setup intent');
      }

      const data = await response.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error validating setup intent:', error);
      setStatus('error');
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/admin/setup');
    } else {
      router.push('/register/organization');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {status === 'processing' && 'Processing Your Registration'}
            {status === 'success' && 'Registration Complete'}
            {status === 'error' && 'Registration Error'}
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Please wait while we confirm your payment...'}
            {status === 'success' && 'Your organization has been successfully created!'}
            {status === 'error' && 'There was an issue with your registration.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          {status === 'processing' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          )}
          {status === 'success' && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === 'error' && <X className="h-16 w-16 text-red-500" />}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={status === 'processing'}
          >
            {status === 'success' && 'Continue to Setup'}
            {status === 'error' && 'Try Again'}
            {status === 'processing' && 'Please Wait...'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 