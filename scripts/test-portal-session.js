#!/usr/bin/env node

// Script to test Stripe Customer Portal sessions
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '.env.local') });

// Check for environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY is not defined in .env.local');
  process.exit(1);
}

// Initialize Stripe with the API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

// Test creating a portal session
async function testPortalSession() {
  try {
    console.log('Testing Stripe Customer Portal session creation...');
    
    // First, let's get the customer ID - this should be a valid customer ID in your Stripe account
    // For this test, we'll use the customer ID from the error message: cus_RzuTmMEsDn0cCE
    const customerId = 'cus_RzuTmMEsDn0cCE';
    console.log(`Using customer ID: ${customerId}`);
    
    // Verify the customer exists
    try {
      const customer = await stripe.customers.retrieve(customerId);
      console.log(`Customer verified: ${customer.id} (${customer.email || 'No email'})`);
    } catch (retrieveError) {
      console.error(`Error: Customer ${customerId} does not exist in Stripe:`, retrieveError.message);
      process.exit(1);
    }
    
    // Create the portal session
    const returnUrl = process.env.NEXT_PUBLIC_APP_URL + '/account';
    console.log(`Using return URL: ${returnUrl}`);
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    console.log('✅ Portal session created successfully!');
    console.log('Portal URL:', session.url);
    
  } catch (error) {
    console.error('❌ Error creating portal session:', error.message);
    console.error('Error type:', error.type);
    
    if (error.raw) {
      console.error('Raw error details:', error.raw);
    }
    
    process.exit(1);
  }
}

testPortalSession(); 