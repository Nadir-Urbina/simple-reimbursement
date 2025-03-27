'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';

interface StripeProviderProps {
  children: ReactNode;
  options?: {
    clientSecret?: string;
    appearance?: {
      theme?: 'stripe' | 'night' | 'flat';
    };
  };
}

export function StripeProvider({ children, options }: StripeProviderProps) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
} 