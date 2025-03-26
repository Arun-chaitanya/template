'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutSuccess() {
  const { isLoading: authLoading } = useAuth({ required: true });
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [subscription, setSubscription] = useState<{
    plan?: string;
    isActive?: boolean;
    endDate?: string;
  }>({});
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    if (!sessionId) {
      router.push('/pricing');
      return;
    }

    // Function to verify payment
    async function verifyPayment() {
      try {
        // First, try to verify directly from Stripe
        const verifyResponse = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const verifyData = await verifyResponse.json();

        if (verifyData.success && verifyData.subscription?.isActive) {
          setStatus('success');
          setSubscription({
            plan: verifyData.subscription.plan,
            isActive: verifyData.subscription.isActive,
            endDate: verifyData.subscription.endDate ? new Date(verifyData.subscription.endDate).toLocaleDateString() : undefined,
          });
          return;
        }

        // If the stripe verification is successful but subscription is still not active,
        // or if we're polling, check the user subscription status separately
        const response = await fetch('/api/user/subscription');
        const data = await response.json();

        if (data.subscription?.isActive) {
          setStatus('success');
          setSubscription({
            plan: data.subscription.plan,
            isActive: data.subscription.isActive,
            endDate: data.subscription.endDate ? new Date(data.subscription.endDate).toLocaleDateString() : undefined,
          });
        } else {
          // Webhook might be delayed, retry after a delay
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          if (newAttempts < maxAttempts) {
            // Exponential backoff: 2s, 4s, 8s, 16s
            const retryDelay = Math.pow(2, newAttempts) * 1000;
            setTimeout(verifyPayment, retryDelay);
          } else {
            // After max attempts, show success anyway if Stripe checkout was successful
            if (verifyData.session?.status === 'complete') {
              setStatus('success');
              setSubscription({
                plan: verifyData.session.metadata?.plan,
                isActive: true,
                endDate: 'Processing',
              });
            } else {
              setStatus('error');
            }
          }
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
      }
    }

    verifyPayment();
  }, [sessionId, router, attempts]);

  if (authLoading || status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner}></div>
          <h1>Processing your subscription...</h1>
          <p>Please wait while we confirm your payment</p>
          {attempts > 0 && (
            <p className={styles.processingNote}>
              This is taking longer than expected. Please be patient as we process your subscription. (Attempt {attempts}/{maxAttempts})
            </p>
          )}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.errorIcon}>!</div>
          <h1>Something went wrong</h1>
          <p>We couldn&apos;t confirm your subscription. Please contact support.</p>
          <div className={styles.actions}>
            <Link href="/pricing" className={styles.button}>
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>✓</div>
        <h1>Thank you for subscribing!</h1>
        <p>Your subscription has been successfully processed.</p>
        
        <div className={styles.subscriptionDetails}>
          <h2>Subscription Details</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Plan:</span>
              <span className={styles.value}>{subscription.plan ? (subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)) : 'Professional'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Status:</span>
              <span className={styles.value}>
                {subscription.isActive ? 'Active' : 'Pending'}
              </span>
            </div>
            {subscription.endDate && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Next billing date:</span>
                <span className={styles.value}>{subscription.endDate}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/documents" className={styles.button}>
            Start Using Writefast
          </Link>
          <Link href="/account" className={styles.secondaryButton}>
            Manage Subscription
          </Link>
        </div>
      </div>
    </div>
  );
} 