import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
import { stripe } from '@/lib/services/stripe';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the session ID from the query parameter
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Fetch the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!checkoutSession || checkoutSession.status !== 'complete') {
      return NextResponse.json({ success: false, message: 'Payment not completed' });
    }

    // Get the user from the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If payment is successful but subscription is not active, update it
    if (checkoutSession.status === 'complete' && !user.subscription?.isActive) {
      // Get plan from metadata
      const plan = checkoutSession.metadata?.plan;
      
      if (plan) {
        // Calculate start and end dates
        const startDate = new Date();
        const endDate = new Date();

        // Set end date based on plan
        switch (plan) {
          case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3);
            break;
          case 'yearly':
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        }

        // Update user subscription
        user.subscription = {
          ...user.subscription,
          plan,
          startDate,
          endDate,
          isActive: true,
          stripeSubscriptionId: checkoutSession.subscription as string,
          cancelAtPeriodEnd: false,
        };
        await user.save();
      }
    }

    // Return updated subscription status
    return NextResponse.json({
      success: true,
      session: checkoutSession,
      subscription: user.subscription || null,
    });
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to verify checkout session' },
      { status: 500 }
    );
  }
} 