import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST() {
  try {
    // Create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      usage: 'off_session', // This allows the payment method to be used for future payments
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 