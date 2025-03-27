import Stripe from 'stripe';
import { Organization } from '@/types/organization';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const SUBSCRIPTION_PRICES = {
  monthly: {
    admin: {
      priceId: process.env.STRIPE_ADMIN_PRICE_ID,
      unitAmount: 2999, // $29.99
    },
    user: {
      priceId: process.env.STRIPE_USER_PRICE_ID,
      unitAmount: 399, // $3.99
    },
  },
  yearly: {
    admin: {
      priceId: process.env.STRIPE_ADMIN_YEARLY_PRICE_ID,
      unitAmount: 29988, // $299.88 (10% discount)
    },
    user: {
      priceId: process.env.STRIPE_USER_YEARLY_PRICE_ID,
      unitAmount: 3588, // $35.88 (10% discount)
    },
  },
} as const;

export async function createOrUpdateCustomer(organization: Organization) {
  const customer = await stripe.customers.create({
    name: organization.name,
    metadata: {
      organizationId: organization.id,
    },
  });

  return customer;
}

export async function createSubscription({
  customerId,
  adminSeats,
  userSeats,
  paymentMethodId,
  billingPeriod = 'monthly',
}: {
  customerId: string;
  adminSeats: number;
  userSeats: number;
  paymentMethodId: string;
  billingPeriod?: 'monthly' | 'yearly';
}) {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Get the correct price IDs based on billing period
    const adminPriceId = SUBSCRIPTION_PRICES[billingPeriod].admin.priceId;
    const userPriceId = SUBSCRIPTION_PRICES[billingPeriod].user.priceId;

    // Create subscription with both admin and user seats
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: adminPriceId,
          quantity: adminSeats,
        },
        {
          price: userPriceId,
          quantity: userSeats,
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function updateSubscription({
  subscriptionId,
  adminSeats,
  userSeats,
  billingPeriod = 'monthly',
}: {
  subscriptionId: string;
  adminSeats: number;
  userSeats: number;
  billingPeriod?: 'monthly' | 'yearly';
}) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Get the correct price IDs based on billing period
  const adminPriceId = SUBSCRIPTION_PRICES[billingPeriod].admin.priceId;
  const userPriceId = SUBSCRIPTION_PRICES[billingPeriod].user.priceId;

  // Update quantities for both items
  const adminItem = subscription.items.data.find(
    (item) => item.price.id === adminPriceId
  );
  const userItem = subscription.items.data.find(
    (item) => item.price.id === userPriceId
  );

  if (!adminItem || !userItem) {
    throw new Error('Subscription items not found');
  }

  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: adminItem.id,
        quantity: adminSeats,
      },
      {
        id: userItem.id,
        quantity: userSeats,
      },
    ],
  });

  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function getUpcomingInvoice({
  customerId,
  subscriptionId,
  adminSeats,
  userSeats,
  billingPeriod = 'monthly',
}: {
  customerId: string;
  subscriptionId?: string;
  adminSeats: number;
  userSeats: number;
  billingPeriod?: 'monthly' | 'yearly';
}) {
  // Get the correct price IDs based on billing period
  const adminPriceId = SUBSCRIPTION_PRICES[billingPeriod].admin.priceId;
  const userPriceId = SUBSCRIPTION_PRICES[billingPeriod].user.priceId;

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
    subscription: subscriptionId,
    subscription_items: [
      {
        price: adminPriceId,
        quantity: adminSeats,
      },
      {
        price: userPriceId,
        quantity: userSeats,
      },
    ],
  });

  return invoice;
}

/**
 * Create a SetupIntent for adding a payment method
 */
export async function getSetupIntent(customerId: string) {
  return stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });
} 