import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
import { 
  createCheckoutSession, 
  createCustomer, 
  createPrice,
  STRIPE_PRICE_IDS, 
  PLAN_PRICES 
} from '@/lib/services/stripe';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { plan } = await req.json();

    // Validate plan
    if (!plan || !['monthly', 'quarterly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    console.log(`Creating checkout session for ${plan} plan`);

    // Connect to database
    await connectDB();

    // Get the user from the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      console.log(`No Stripe customer found for user ${user.email}. Creating new customer...`);
      const customer = await createCustomer({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
      console.log(`Created Stripe customer: ${stripeCustomerId}`);

      // Update user with Stripe customer ID
      user.subscription = {
        ...user.subscription,
        stripeCustomerId,
      };
      await user.save();
    } else {
      console.log(`Using existing Stripe customer: ${stripeCustomerId}`);
    }

    // Get or create the Stripe price ID for the selected plan
    let priceId = STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS];

    // If price ID is not set in env vars or cache, create a new price
    if (!priceId) {
      console.log(`Price ID for ${plan} plan not found in cache or env. Creating a new price...`);
      const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
      const interval = plan === 'monthly' ? 'month' : plan === 'quarterly' ? 'quarter' : 'year';
      
      const price = await createPrice(amount, interval);
      priceId = price.id;
      
      console.log(`Created/reused price ID: ${priceId}`);
    } else {
      console.log(`Using existing price ID for ${plan} plan: ${priceId}`);
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: user._id.toString(),
        plan,
      },
    });

    console.log(`Checkout session created: ${checkoutSession.id}`);

    // Return the checkout URL
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 