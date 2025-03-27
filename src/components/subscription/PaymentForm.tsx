'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentError: (error: Error) => void;
}

export function PaymentForm({ onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the setup using the client secret
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/register/organization/complete`,
        }
      });

      if (error) {
        onPaymentError(error);
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        onPaymentSuccess(setupIntent.payment_method as string);
      } else {
        throw new Error('No payment method was returned');
      }
    } catch (e) {
      onPaymentError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Payment'
        )}
      </Button>
    </form>
  );
} 