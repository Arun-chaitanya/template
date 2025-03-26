'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SubscriptionManagement.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { IUser } from '@/models/User';

export function SubscriptionManagement() {
  const { session, isLoading: authLoading } = useAuth({ required: true });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const subscription = session?.user?.subscription;

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorMsg: string) => {
    if (errorMsg.includes('Invalid URL')) {
      return 'There is a configuration issue with our payment system. Please contact support.';
    } else if (errorMsg.includes('not properly configured')) {
      return 'Our payment system is temporarily unavailable. Please try again later or contact support.';
    } else if (errorMsg.includes('No active subscription')) {
      return 'You don\'t have an active subscription. Please visit our pricing page to subscribe.';
    } else if (errorMsg.includes('No such customer')) {
      return 'Your payment information could not be found. Please update your subscription details.';
    }
    return errorMsg || 'There was an error connecting to the payment service. Please try again later.';
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPlanName = (plan: string | undefined) => {
    if (!plan) return 'No Plan';
    const planNames = {
      monthly: 'Monthly Plan',
      quarterly: 'Quarterly Plan',
      yearly: 'Annual Plan',
    };
    return planNames[plan as keyof typeof planNames] || plan;
  };

  const getPlanPrice = (plan: string | undefined) => {
    if (!plan) return '';
    const planPrices = {
      monthly: '$15/month',
      quarterly: '$12/month (billed quarterly)',
      yearly: '$10/month (billed annually)',
    };
    return planPrices[plan as keyof typeof planPrices] || '';
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ 
          flow: 'manage_billing',
          returnTo: '/account'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        router.push(data.url);
      } else {
        console.error('Failed to create portal session:', data.error || 'Unknown error');
        setIsLoading(false);
        
        // If we get any response with redirectUrl, redirect to that page
        if (data.redirectUrl) {
          console.log(`Redirecting to: ${data.redirectUrl}`);
          router.push(data.redirectUrl);
          return;
        }
        
        // Show user-friendly error message
        setError(getErrorMessage(data.error || 'Failed to access subscription portal'));
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      setIsLoading(false);
      setError('There was an error connecting to the subscription service. Please try again later.');
    }
  };

  const handleViewPricing = () => {
    router.push('/pricing');
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please contact support or try again later.');
      return;
    }
    setRetryCount(retryCount + 1);
    setError(null);
    handleManageSubscription();
  };

  const handleContactSupport = () => {
    // Open mailto link or redirect to contact page
    window.location.href = 'mailto:support@writefast.com?subject=Subscription Portal Issue';
  };

  if (authLoading) {
    return <div className={styles.loading}>Loading subscription details...</div>;
  }

  if (!subscription?.isActive) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Subscription</h2>
        </div>
        <div className={styles.noSubscription}>
          <p>You don&apos;t have an active subscription.</p>
          <button 
            className={styles.button}
            onClick={() => router.push('/pricing')}
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Subscription</h2>
        <div className={styles.headerButtons}>
          <button 
            className={styles.manageButton}
            onClick={handleManageSubscription}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Manage Billing'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <div className={styles.errorText}>{error}</div>
          <div className={styles.errorActions}>
            <button 
              className={styles.retryButton} 
              onClick={handleRetry}
              disabled={retryCount >= 3}
            >
              Retry
            </button>
            <button 
              className={styles.viewPricingButton} 
              onClick={handleViewPricing}
            >
              View Pricing
            </button>
            <button 
              className={styles.supportButton} 
              onClick={handleContactSupport}
            >
              Contact Support
            </button>
          </div>
        </div>
      )}

      <div className={styles.details}>
        <div className={styles.statusBadge}>
          <span className={styles.activeIndicator}></span>
          Active
        </div>

        <div className={styles.info}>
          <div className={styles.row}>
            <span className={styles.label}>Plan</span>
            <span className={styles.value}>{getPlanName(subscription.plan)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Price</span>
            <span className={styles.value}>{getPlanPrice(subscription.plan)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Start date</span>
            <span className={styles.value}>{formatDate(subscription.startDate)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Renewal date</span>
            <span className={styles.value}>{formatDate(subscription.endDate)}</span>
          </div>
          {(subscription as IUser['subscription'])?.cancelAtPeriodEnd && (
            <div className={styles.cancellationNote}>
              Your subscription will end on the renewal date and will not be renewed automatically.
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionCard}>
        <h3>Manage Your Subscription</h3>
        <p>You can update payment methods or cancel your subscription at any time through the Stripe portal.</p>
        
        <div className={styles.actionButtons}>
          <button
            className={styles.primaryButton}
            onClick={handleManageSubscription}
            disabled={isLoading}
          >
            Manage Subscription
          </button>
        </div>
      </div>

      <div className={styles.benefits}>
        <h3>Your Benefits</h3>
        <ul className={styles.benefitsList}>
          <li>Access to Master SOP Template</li>
          <li>Create University-specific SOPs</li>
          <li>Multiple LOR Types</li>
          <li>University Essays</li>
          <li>AI Writing Assistant</li>
          <li>Priority Support</li>
        </ul>
      </div>
    </div>
  );
} 