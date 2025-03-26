import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// In-memory cache for price IDs (this will persist until server restart)
const cachedPriceIds: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || '',
  quarterly: process.env.STRIPE_PRICE_QUARTERLY || '',
  yearly: process.env.STRIPE_PRICE_YEARLY || '',
};

// Define the product IDs for each subscription plan
export const STRIPE_PRICE_IDS = {
  get monthly() { return cachedPriceIds.monthly; },
  get quarterly() { return cachedPriceIds.quarterly; },
  get yearly() { return cachedPriceIds.yearly; },
};

// Define the product prices for each subscription plan
export const PLAN_PRICES = {
  monthly: 15,
  quarterly: 36, // $12/month billed quarterly
  yearly: 120, // $10/month billed yearly
};

// Find existing products by name
export async function findExistingProduct(productName: string) {
  const products = await stripe.products.list({
    active: true,
    limit: 100, // Adjust based on your needs
  });

  return products.data.find(product => product.name === productName);
}

// Find existing price by product ID and amount
export async function findExistingPrice(productId: string, amount: number, interval: string, intervalCount: number) {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });

  return prices.data.find(price => 
    price.unit_amount === amount * 100 && 
    price.recurring?.interval === interval &&
    price.recurring?.interval_count === intervalCount
  );
}

// Create a Stripe price (fallback if price ID not found)
export async function createPrice(amount: number, interval: 'month' | 'quarter' | 'year') {
  // Cache key for the plan type
  const planType = interval === 'month' ? 'monthly' : interval === 'quarter' ? 'quarterly' : 'yearly';
  
  // Return cached ID if it exists
  if (cachedPriceIds[planType]) {
    console.log(`Using cached price ID for ${planType} plan: ${cachedPriceIds[planType]}`);
    return { id: cachedPriceIds[planType] };
  }

  // Product name format
  const productName = `WriteText ${interval.charAt(0).toUpperCase() + interval.slice(1)} Plan`;
  
  // Map interval to stripe intervals
  const intervalMapping = {
    month: 'month', 
    quarter: 'month',  // Stripe doesn't have quarter, so we'll use 3 months
    year: 'year'
  };
  const intervalCount = interval === 'quarter' ? 3 : 1;
  
  try {
    // Check if product already exists
    let product = await findExistingProduct(productName);
    
    // Create product if it doesn't exist
    if (!product) {
      console.log(`Creating new product: ${productName}`);
      product = await stripe.products.create({
        name: productName,
        description: `WriteText subscription with ${interval}ly billing`,
      });
    } else {
      console.log(`Found existing product: ${product.id} (${productName})`);
    }

    // Check if price already exists for this product
    let price = await findExistingPrice(
      product.id, 
      amount, 
      intervalMapping[interval], 
      intervalCount
    );

    // Create price if it doesn't exist
    if (!price) {
      console.log(`Creating new price for product ${product.id}`);
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount * 100, // Stripe uses cents
        currency: 'usd',
        recurring: {
          interval: intervalMapping[interval] as 'month' | 'year',
          interval_count: intervalCount,
        },
      });
    } else {
      console.log(`Found existing price: ${price.id}`);
    }

    // Cache the price ID
    cachedPriceIds[planType] = price.id;
    console.log(`Cached price ID for ${planType} plan: ${price.id}`);
    
    // Tip for updating env file
    console.log(`TIP: Add this to your .env file: STRIPE_PRICE_${planType.toUpperCase()}=${price.id}`);
    
    return price;
  } catch (error) {
    console.error('Error creating price:', error);
    throw error;
  }
}

// Create a Stripe checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
}

// Retrieve a Stripe customer
export async function getCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId);
}

// Create a Stripe customer
export async function createCustomer({ email, name }: { email: string; name: string }) {
  return stripe.customers.create({
    email,
    name,
  });
}

// Retrieve a Stripe subscription
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// Cancel a Stripe subscription
export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Get Stripe portal session URL
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Export the stripe instance for direct API access
export { stripe }; 