# SubscriptionGuard Component

## Overview

The `SubscriptionGuard` is a client component that protects routes from users who don't have an active subscription. It redirects non-subscribed users to the main `/documents` page.

## Usage

To protect a route or a group of routes, wrap them with the `SubscriptionGuard` component in a layout file:

```tsx
import { SubscriptionGuard } from '@/components/common/SubscriptionGuard';

export default function SomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}
```

## How It Works

1. The component uses the `useAuth` hook to get the user's session.
2. It checks if the user has an active subscription (`session?.user?.subscription?.isActive`).
3. If the user is not subscribed, it redirects them to `/documents` using Next.js router.
4. If the user is subscribed, it renders the children components normally.

## Implementation Details

- The component returns `null` when the user is not subscribed to prevent any flash of content before the redirect.
- The redirect happens in a `useEffect` hook to ensure it only runs on the client.
- The component is marked with `'use client'` since it uses client hooks like `useRouter` and `useEffect`. 