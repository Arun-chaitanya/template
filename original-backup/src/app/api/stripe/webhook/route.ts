import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/services/stripe';
import connectDB from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed:`, err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  console.log(`✅ Received Stripe webhook event: ${event.type}`);
  console.log(`Event ID: ${event.id}`);

  try {
    // Connect to MongoDB
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
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Processing checkout session completed: ${session.id}`);

      // Retrieve the user from the database
      const user = await usersCollection.findOne({
        email: session.customer_email,
      });

      if (!user) {
        console.error(`No user found with email: ${session.customer_email}`);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log(`Found user: ${user._id}, checking subscription status`);

      // Check if the payment was successful
      if (session.payment_status === 'paid') {
        console.log(`Payment successful for session ${session.id}`);
        
        // Check for customer ID and store it if not present
        if (session.customer && !user.stripeCustomerId) {
          console.log(`Updating user with Stripe customer ID: ${session.customer}`);
          await usersCollection.updateOne(
            { _id: user._id },
            { 
              $set: { 
                stripeCustomerId: session.customer 
              } 
            }
          );
        } else if (!session.customer) {
          console.warn(`No customer ID in checkout session ${session.id}`);
        }

        // Ensure we have metadata
        if (!session.metadata || !session.metadata.plan) {
          console.error(`Missing metadata or plan in session ${session.id}`);
          return NextResponse.json(
            { error: 'Missing metadata' },
            { status: 400 }
          );
        }

        const plan = session.metadata.plan;
        console.log(`Subscription plan: ${plan}`);

        // Calculate subscription dates
        const startDate = new Date();
        
        // Default to monthly (30 days)
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        
        // If annual, set to 365 days
        if (plan.includes('annual')) {
          endDate = new Date();
          endDate.setDate(endDate.getDate() + 365);
          console.log('Setting annual subscription: 365 days');
        }

        console.log(`Subscription period: ${startDate.toISOString()} to ${endDate.toISOString()}`);

        // Update the user's subscription status in the database
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              subscription: {
                status: 'active',
                plan: plan,
                startDate: startDate,
                endDate: endDate,
                cancelAtPeriodEnd: false
              },
            },
          }
        );
        
        console.log(`✅ User subscription updated successfully for ${user.email}`);
      } else {
        console.log(`⚠️ Payment not completed for session ${session.id}. Status: ${session.payment_status}`);
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Processing subscription update: ${subscription.id}`);
      
      // Get the customer ID
      const customerId = subscription.customer as string;
      console.log(`Customer ID: ${customerId}`);
      
      if (!customerId) {
        console.error('No customer ID in subscription update event');
        return NextResponse.json(
          { error: 'Customer ID not found' },
          { status: 400 }
        );
      }

      // Find the user with this Stripe customer ID
      const user = await usersCollection.findOne({
        stripeCustomerId: customerId,
      });

      if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log(`Found user: ${user._id} (${user.email})`);

      // Check the subscription status
      const status = subscription.status;
      console.log(`Subscription status: ${status}`);

      // Extract plan information from the subscription
      let plan = user.subscription?.plan || 'unknown';

      // Try to determine the plan based on the metadata or product information
      const productId = subscription.items.data[0]?.plan?.product as string;
      if (productId) {
        try {
          const product = await stripe.products.retrieve(productId);
          if (product.metadata?.plan) {
            plan = product.metadata.plan;
            console.log(`Found plan from product metadata: ${plan}`);
          } else {
            console.log(`Product has no plan metadata. Using name: ${product.name}`);
            plan = product.name.toLowerCase().includes('annual') ? 'premium-annual' : 'premium-monthly';
          }
        } catch (err) {
          console.error(`Error retrieving product ${productId}:`, err);
        }
      }

      console.log(`Plan identified as: ${plan}`);

      // Calculate subscription dates
      const startDate = new Date(subscription.current_period_start * 1000);
      const endDate = new Date(subscription.current_period_end * 1000);
      
      console.log(`Subscription period: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      console.log(`Cancel at period end: ${subscription.cancel_at_period_end}`);

      // Update the user's subscription
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            subscription: {
              status: status === 'active' ? 'active' : 'inactive',
              plan: plan,
              startDate: startDate,
              endDate: endDate,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          },
        }
      );
      
      console.log(`✅ Updated subscription for user ${user.email}`);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Processing subscription deletion: ${subscription.id}`);
      
      // Get the customer ID
      const customerId = subscription.customer as string;
      console.log(`Customer ID: ${customerId}`);
      
      if (!customerId) {
        console.error('No customer ID in subscription deletion event');
        return NextResponse.json(
          { error: 'Customer ID not found' },
          { status: 400 }
        );
      }

      // Find the user with this Stripe customer ID
      const user = await usersCollection.findOne({
        stripeCustomerId: customerId,
      });

      if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log(`Found user: ${user._id} (${user.email})`);

      // Set subscription to inactive
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            subscription: {
              ...user.subscription,
              status: 'inactive',
              cancelAtPeriodEnd: false,
            },
          },
        }
      );
      
      console.log(`✅ Marked subscription as inactive for user ${user.email}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json(
      { received: true },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error(`❌ Error processing webhook event ${event.type}:`, err);
    return NextResponse.json(
      { error: 'Error processing webhook event' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 