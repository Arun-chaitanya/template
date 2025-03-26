import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/services/stripe';
import { createCustomer } from '@/lib/services/stripe';
import { getUserSession } from '@/lib/session';
import connectDB from '@/lib/db';

// Define a type that matches the structure of common Stripe errors
interface StripeErrorLike {
  code?: string;
  statusCode?: number;
  type?: string;
  message: string;
  raw?: {
    message?: string;
    type?: string;
    code?: string;
    param?: string;
  };
}

// Define a more specific error type
interface ServerError extends Error {
  stack?: string;
}

/**
 * Ensures a URL has a proper scheme (https:// or http://)
 */
function ensureUrlScheme(url: string): string {
  if (!url) return 'http://localhost:3000';
  
  // If URL already has a scheme, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, add https:// as the default scheme
  return `https://${url}`;
}

// Add this new function to create a portal session with specific configuration
async function createPortalSessionWithConfiguration(customerId: string, returnUrl: string, flow: string) {
  console.log(`Creating portal session for customer: ${customerId} with flow: ${flow}`);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined or empty in environment variables');
  }

  // Check if the API key starts with sk_test or sk_live
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') && !process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    throw new Error('STRIPE_SECRET_KEY appears to be malformed. It should start with sk_test_ or sk_live_');
  }
  
  try {
    // Check if the customer exists in Stripe first
    try {
      await stripe.customers.retrieve(customerId);
      console.log(`Customer ${customerId} exists in Stripe`);
    } catch (retrieveError) {
      console.error(`Error retrieving customer ${customerId}:`, retrieveError);
      throw new Error(`Customer does not exist in Stripe: ${customerId}`);
    }
    
    console.log(`Using return URL: ${returnUrl}`);
    
    // Base options for all portal sessions
    const baseOptions = {
      customer: customerId,
      return_url: returnUrl,
    };
    
    // For plan change flow, we create a session that specifically focuses on plan changes
    if (flow === 'plan_change') {
      console.log('Creating portal session configured for plan change');
      
      // Get any active subscriptions for this customer to use in the request
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });
      
      if (!subscriptions || !subscriptions.data || subscriptions.data.length === 0) {
        console.log('No active subscriptions found for customer, using default portal session');
        const session = await stripe.billingPortal.sessions.create(baseOptions);
        console.log(`Portal session created: ${session.url}`);
        return session;
      }
      
      const subscriptionId = subscriptions.data[0].id;
      console.log(`Using subscription ${subscriptionId} for portal session`);
      
      // For direct plan selection (we're using URL parameters to direct Stripe's portal UI)
      // This is the most reliable way to get users directly to the plan selection page
      const portalUrl = await stripe.billingPortal.sessions.create(baseOptions);
      
      // Construct a URL that directly navigates to the subscription update page
      // Format: https://billing.stripe.com/p/session/xxx#/subscriptions/{subscriptionId}/edit
      const directPlanUrl = `${portalUrl.url.split('#')[0]}#/subscriptions/${subscriptionId}/edit`;
      console.log(`Direct plan change URL: ${directPlanUrl}`);
      
      // Return a custom portal session object with our constructed URL
      return {
        url: directPlanUrl
      };
    }
    
    // For general billing management (default)
    console.log('Creating general portal session for billing management');
    const session = await stripe.billingPortal.sessions.create(baseOptions);
    console.log(`Portal session created: ${session.url}`);
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log('POST request to create Stripe portal session received');
  
  // Check if Stripe API key is properly configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not defined in the environment variables');
    return NextResponse.json(
      { 
        error: 'Payment provider not properly configured', 
        redirectUrl: '/account' 
      },
      { status: 500 }
    );
  }
  
  // Check if app URL is configured
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('NEXT_PUBLIC_APP_URL is not defined in the environment variables');
    return NextResponse.json(
      { 
        error: 'Application URL not properly configured', 
        redirectUrl: '/account' 
      },
      { status: 500 }
    );
  }
  
  try {
    // Parse request data if it exists
    let flow = 'manage_billing'; // Default flow
    let returnTo = '/account'; // Default return URL path
    
    // Check if we have a request body
    if (req.body) {
      try {
        const { flow: requestFlow, returnTo: requestReturnTo } = await req.json();
        if (requestFlow && ['plan_change', 'manage_billing'].includes(requestFlow)) {
          flow = requestFlow;
        }
        if (requestReturnTo) {
          returnTo = requestReturnTo;
        }
      } catch (parseError) {
        console.warn('Error parsing request body, using defaults:', parseError);
      }
    }
    
    console.log(`Portal session flow: ${flow}, return path: ${returnTo}`);
    console.log('Stripe API Key configured:', process.env.STRIPE_SECRET_KEY.substring(0, 8) + '...');
    console.log('App URL configured:', process.env.NEXT_PUBLIC_APP_URL);
    
    // Get user session
    const session = await getUserSession();
    if (!session || !session.user?.email) {
      console.error('No valid user session found');
      return NextResponse.json(
        { error: 'Unauthorized', redirectUrl: '/auth/signin' },
        { status: 401 }
      );
    }
    
    console.log(`Processing portal session for user: ${session.user.email}`);
    
    // Connect to database and get user
    const mongoose = await connectDB();
    // Ensure connection is defined
    if (!mongoose.connection || !mongoose.connection.db) {
      console.error('MongoDB connection not established');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email: session.user.email });
    if (!user) {
      console.error(`User not found with email: ${session.user.email}`);
      return NextResponse.json(
        { error: 'User not found', redirectUrl: '/auth/signin' },
        { status: 404 }
      );
    }
    
    console.log(`User found: ${user._id}`);
    
    // Check if user has an active subscription
    // Handle both status field and isActive field for backward compatibility
    const hasActiveSubscription = (
      (user.subscription?.status === 'active') || 
      (user.subscription?.isActive === true)
    );
    
    // Debug subscription details
    console.log(`Subscription status details:
      subscription object: ${JSON.stringify(user.subscription || {})}
      status field: ${user.subscription?.status}
      isActive field: ${user.subscription?.isActive}
      hasActiveSubscription: ${hasActiveSubscription}
      stripeCustomerId: ${user.stripeCustomerId || user.subscription?.stripeCustomerId || 'none'}
    `);
    
    // Get customer ID from either the user object or subscription object
    const stripeCustomerId = user.stripeCustomerId || user.subscription?.stripeCustomerId;
    
    // Check if user has a Stripe customer ID
    if (!stripeCustomerId) {
      console.log(`No Stripe customer ID found for user: ${user._id}`);
      
      // If user has active subscription but no customer ID, create a new customer
      if (hasActiveSubscription) {
        console.log('User has active subscription but no customer ID. Creating new customer...');
        try {
          const customer = await createCustomer({
            email: user.email,
            name: user.name || user.email,
          });
          
          console.log(`New customer created: ${customer.id}`);
          
          // Update user with new customer ID - try both places to ensure backward compatibility
          await usersCollection.updateOne(
            { _id: user._id },
            { 
              $set: { 
                stripeCustomerId: customer.id,
                'subscription.stripeCustomerId': customer.id
              } 
            }
          );
          
          // Create portal session with new customer ID
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
          const returnUrl = ensureUrlScheme(`${appUrl}${returnTo}`);
          
          // Create portal session
          const portalSession = await createPortalSessionWithConfiguration(customer.id, returnUrl, flow);
          return NextResponse.json({ url: portalSession.url });
        } catch (error) {
          console.error('Error creating new customer:', error);
          return NextResponse.json(
            { 
              error: 'Unable to create customer',
              redirectUrl: '/pricing' 
            },
            { status: 500 }
          );
        }
      } else {
        // User has no subscription and no customer ID, redirect to pricing
        console.log('User has no active subscription and no customer ID');
        return NextResponse.json(
          { 
            error: 'No active subscription',
            redirectUrl: '/pricing' 
          },
          { status: 400 }
        );
      }
    }
    
    // User has a customer ID, create portal session
    console.log(`Creating portal session with customer ID: ${stripeCustomerId}`);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const returnUrl = ensureUrlScheme(`${appUrl}${returnTo}`);
      
      // Create portal session with appropriate configuration based on flow
      const portalSession = await createPortalSessionWithConfiguration(stripeCustomerId, returnUrl, flow);
      return NextResponse.json({ url: portalSession.url });
    } catch (stripeError: unknown) {
      const error = stripeError as StripeErrorLike;
      console.error('Error creating portal session with Stripe:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        raw: error.raw ? {
          message: error.raw.message,
          type: error.raw.type,
          code: error.raw.code,
          param: error.raw.param,
        } : 'No raw data'
      });
      
      // Check if this is an invalid URL error
      if (error.message?.includes('Invalid URL') || error.raw?.message?.includes('Invalid URL')) {
        console.error('Invalid URL error - NEXT_PUBLIC_APP_URL might be misconfigured');
        return NextResponse.json(
          { 
            error: 'Application configuration error. Please contact support.', 
            redirectUrl: '/account' 
          },
          { status: 500 }
        );
      }
      
      // Check if this is a Stripe error related to customer not found
      if (
        error.code === 'resource_missing' || 
        error.statusCode === 404 ||
        error.message?.includes('No such customer') ||
        error.raw?.message?.includes('No such customer')
      ) {
        console.log('Customer not found in Stripe or is invalid, clearing customer ID and redirecting to pricing');
        
        // Reset the customer ID in the database since it's invalid
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $unset: { 
              stripeCustomerId: "",
              'subscription.stripeCustomerId': "" 
            } 
          }
        );
        
        return NextResponse.json(
          { 
            error: 'Your payment information could not be found. Please set up a subscription.',
            redirectUrl: '/pricing' 
          },
          { status: 400 }
        );
      }
      
      // For other Stripe errors
      return NextResponse.json(
        { 
          error: `Failed to connect to payment provider: ${error.message || 'Unknown error'}`, 
          redirectUrl: '/account' 
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const serverError = error as ServerError;
    console.error('Error in create-portal-session:', serverError);
    console.error('Error stack:', serverError.stack);
    return NextResponse.json(
      { 
        error: `Server error: ${serverError.message || 'Unknown error'}`, 
        redirectUrl: '/account' 
      },
      { status: 500 }
    );
  }
} 