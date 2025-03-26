#!/usr/bin/env node

// Script to set up Stripe Customer Portal configuration
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

// Configure the Customer Portal settings
async function configureCustomerPortal() {
  try {
    console.log('Configuring Stripe Customer Portal settings...');
    console.log('Using Stripe API key:', process.env.STRIPE_SECRET_KEY.slice(0, 8) + '...');
    console.log('Default return URL:', process.env.NEXT_PUBLIC_APP_URL + '/account');

    // Create basic configuration with minimum required fields
    const configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'WriteFast Subscription Management',
      },
      features: {
        subscription_cancel: { enabled: true },
        payment_method_update: { enabled: true },
      },
      default_return_url: process.env.NEXT_PUBLIC_APP_URL + '/account',
    });

    console.log('✅ Stripe Customer Portal configured successfully!');
    console.log('Configuration ID:', configuration.id);
    
  } catch (error) {
    console.error('❌ Error configuring Stripe Customer Portal:', error.message);
    console.error('Error type:', error.type);
    console.error('Error details:', error);
    
    if (error.message && error.message.includes('No such API key')) {
      console.log('\nTIP: Check that your STRIPE_SECRET_KEY in .env.local is correct and up to date.');
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      console.log('\nTIP: You may need to manually create this configuration in the Stripe Dashboard:');
      console.log('https://dashboard.stripe.com/test/settings/billing/portal');
    }
    
    process.exit(1);
  }
}

configureCustomerPortal(); 