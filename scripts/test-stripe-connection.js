import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('No .env.local file found, using process.env');
  dotenv.config();
}

// Check if STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

// Create a new instance of the Stripe class with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Test the connection by listing customers
async function testStripeConnection() {
  console.log('Testing Stripe connection...');
  console.log(`Using API key: ${process.env.STRIPE_SECRET_KEY.substring(0, 8)}...`);
  
  try {
    // Try to list customers (limit to 1)
    const customers = await stripe.customers.list({ limit: 1 });
    console.log('✅ Stripe connection successful!');
    console.log(`Found ${customers.data.length} customers`);
    console.log('API response:', JSON.stringify(customers, null, 2).substring(0, 200) + '...');
    
    // Return true if connection is successful
    return true;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    console.error('Full error:', error);
    
    // Return false if connection failed
    return false;
  }
}

// Run the test
testStripeConnection().then((success) => {
  if (success) {
    console.log('\nNext steps:');
    console.log('1. Restart your Next.js server');
    console.log('2. Try accessing the subscription management page again');
  } else {
    console.log('\nTroubleshooting:');
    console.log('1. Check that your Stripe API key is correct');
    console.log('2. Ensure your Stripe account is active');
    console.log('3. Check for any network restrictions that might block requests to api.stripe.com');
  }
}); 