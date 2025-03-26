'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth({ required = true } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (required && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [required, status, router]);

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
} 