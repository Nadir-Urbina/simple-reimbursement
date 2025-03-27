import { NextResponse } from 'next/server';
import { createOrUpdateCustomer, createSubscription } from '@/lib/stripe/server';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { stripe } from '@/lib/stripe/server';
import { getSetupIntent } from '@/lib/stripe/server';
import { generatePassword } from '@/lib/utils';

// Update the coupon constants
const YEARLY_PROMO_CODE = 'YEARLY15'; // 15% yearly discount promotion code

export async function POST(req: Request) {
  try {
    const {
      name,
      adminName,
      adminEmail,
      adminLicenses,
      userLicenses,
      billingPeriod = 'monthly',
      paymentMethodId,
    } = await req.json();

    // Create customer in Stripe
    const customer = await stripe.customers.create({
      name,
      email: adminEmail,
      metadata: {
        organizationName: name,
      },
    });

    // Get the correct price IDs for billing period
    const isMonthly = billingPeriod === 'monthly';
    
    // Create subscription with promotion code for yearly billing
    const subscriptionData = {
      customer: customer.id,
      items: [
        {
          price: isMonthly ? process.env.STRIPE_ADMIN_PRICE_ID : process.env.STRIPE_ADMIN_YEARLY_PRICE_ID,
          quantity: adminLicenses,
        },
        {
          price: isMonthly ? process.env.STRIPE_USER_PRICE_ID : process.env.STRIPE_USER_YEARLY_PRICE_ID,
          quantity: userLicenses,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    };
    
    // Check if promotion code exists and apply it for yearly billing
    if (!isMonthly) {
      try {
        // Try to find the promotion code by code
        const promotionCodes = await stripe.promotionCodes.list({
          code: YEARLY_PROMO_CODE,
          active: true,
        });
        
        if (promotionCodes.data.length > 0) {
          const promoCode = promotionCodes.data[0];
          subscriptionData.promotion_code = promoCode.id;
          console.log(`Applied promotion code ${YEARLY_PROMO_CODE} with ${promoCode.coupon.percent_off}% discount`);
        } else {
          console.log(`Promotion code ${YEARLY_PROMO_CODE} not found or inactive, continuing without discount`);
        }
      } catch (promoError) {
        // If promotion code doesn't exist, continue without it
        console.log(`Error finding promotion code ${YEARLY_PROMO_CODE}: ${promoError.message}`);
      }
    }
    
    const subscription = await stripe.subscriptions.create(subscriptionData);

    // Create admin user in Firebase Auth with a temporary password
    const tempPassword = generatePassword();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      tempPassword
    );

    // Create organization in Firestore
    const organizationRef = doc(collection(db, 'organizations'));
    const organizationId = organizationRef.id;
    
    await setDoc(organizationRef, {
      id: organizationId,
      name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      billingPeriod,
      licenses: {
        admin: {
          total: adminLicenses,
          used: 1, // Initial admin counts as one used license
        },
        user: {
          total: userLicenses,
          used: 0,
        },
      },
      settings: {
        approvalWorkflows: {
          default: {
            name: "Default Workflow",
            levels: 1,
            thresholds: [
              {
                amount: 100,
                levels: 1,
              },
              {
                amount: 500,
                levels: 2,
              },
              {
                amount: 1000,
                levels: 3,
              }
            ]
          }
        },
        expenseCategories: [
          "Travel",
          "Meals",
          "Office Supplies",
          "Software",
          "Hardware",
          "Events",
          "Other"
        ],
        taxRates: [],
        currencyDefault: "USD",
      }
    });

    // Create admin user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      id: userCredential.user.uid,
      name: adminName,
      email: adminEmail,
      role: "org_admin",
      permissions: {
        admin: true,
        approver: {
          isApprover: true,
          levels: [1, 2, 3, 4, 5], // Admin can approve all levels
        },
        submitter: true,
        viewer: true,
      },
      organizationId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create default approval groups
    await setDoc(doc(db, 'organizations', organizationId, 'approvalGroups', 'default'), {
      id: 'default',
      name: 'Default Group',
      description: 'Default approval group for all users',
      workflowId: 'default',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`Temporary password for ${adminEmail}: ${tempPassword}`);

    // Get setup intent for adding payment method
    const setupIntent = await getSetupIntent(customer.id);

    return NextResponse.json({
      organizationId,
      adminId: userCredential.user.uid,
      setupIntent: {
        clientSecret: setupIntent.client_secret,
      },
      temporaryPassword: tempPassword,
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; 