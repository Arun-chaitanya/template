# Next.js SaaS Boilerplate

A production-ready Next.js boilerplate for SaaS applications with authentication, Stripe subscriptions, AI capabilities, and standard pages.

## Features

- 🔐 Authentication with NextAuth.js
  - Email/Passwordless authentication
  - Google OAuth integration
  - MongoDB adapter for user storage
- 💰 Stripe integration
  - Subscription management
  - Checkout and customer portal
  - Webhook support
- 🤖 AI Integration
  - OpenAI API integration
  - Text generation with GPT models
  - Image generation with DALL-E
- 📄 Standard pages
  - Privacy Policy
  - Terms of Service
  - Refund Policy
  - Contact Form
- 🛠️ Developer Experience
  - TypeScript for type safety
  - ESLint and Prettier for code quality
  - SCSS for styling

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- MongoDB database
- Stripe account
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-saas-boilerplate.git
cd next-saas-boilerplate
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then fill in your environment variables in `.env.local`.

4. Start the development server:
```bash
yarn dev
```

## Environment Variables

Here are the key environment variables you need to configure:

### Authentication
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: A random string for NextAuth.js session encryption

### Email (for passwordless auth)
- `EMAIL_SERVER_HOST`: SMTP server host
- `EMAIL_SERVER_PORT`: SMTP server port
- `EMAIL_SERVER_USER`: SMTP server username
- `EMAIL_SERVER_PASSWORD`: SMTP server password
- `EMAIL_FROM`: From email address

### MongoDB
- `MONGODB_URI`: Your MongoDB connection string

### Stripe
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### OpenAI
- `OPENAI_API_KEY`: Your OpenAI API key

## Customization

### Pricing Plans

Edit the pricing plans in `src/lib/services/stripe.ts`:

```typescript
export const PLAN_PRICES = {
  monthly: 15,
  quarterly: 36,
  yearly: 120,
};
```

### AI Integration

The boilerplate includes a generic LLM service in `src/lib/services/llm-service.ts` with the following capabilities:

```typescript
// Generate text with custom system and user prompts
const result = await llmService.generateText(
  "You are a helpful assistant",
  "Tell me about Next.js"
);

// Generate an image
const imageUrl = await llmService.generateImage(
  "A beautiful sunset over mountains"
);
```

### Branding

Update the app name in your `.env.local`:

```
NEXT_PUBLIC_APP_NAME=Your App Name
```

## Deployment

### Using Vercel

The easiest way to deploy is using Vercel:

```bash
yarn global add vercel
vercel
```

### Manual Deployment

1. Build the application:
```bash
yarn build
```

2. Start the production server:
```bash
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
