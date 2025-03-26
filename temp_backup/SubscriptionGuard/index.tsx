'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { session } = useAuth({ required: true });
  const router = useRouter();
  
  const isSubscribed = session?.user?.subscription?.isActive;

  useEffect(() => {
    if (session && !isSubscribed) {
      router.push('/documents');
    }
  }, [session, isSubscribed, router]);

  // If not subscribed, return null to prevent flickering
  // The redirect will happen from the useEffect
  if (!isSubscribed) {
    return null;
  }

  // If subscribed, render the children
  return <>{children}</>;
} 