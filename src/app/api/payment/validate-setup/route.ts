import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST(req: Request) {
  try {
    const { setupIntentId, clientSecret } = await req.json();

    if (!setupIntentId || !clientSecret) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Retrieve the setup intent from Stripe
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    // Verify the client secret matches
    if (
      setupIntent.client_secret === clientSecret &&
      setupIntent.status === 'succeeded'
    ) {
      return NextResponse.json({
        success: true,
        paymentMethodId: setupIntent.payment_method,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid setup intent', success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error validating setup intent:', error);
    return NextResponse.json(
      { error: 'Failed to validate setup intent', success: false },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 