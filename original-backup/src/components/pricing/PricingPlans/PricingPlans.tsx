'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './PricingPlans.module.scss';
import { useAuth } from '@/hooks/useAuth';

type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

const features = [
  { text: 'Master SOP Template', included: true },
  { text: 'University-specific SOPs', included: true },
  { text: 'Multiple LOR Types', included: true },
  { text: 'University Essays', included: true },
  { text: 'AI Writing Assistant', included: true },
  { text: 'Priority Support', included: true },
];

export function PricingPlans() {
  const [isLoading, setIsLoading] = useState<BillingCycle | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<{
    plan?: string;
    isActive?: boolean;
  } | null>(null);
  const router = useRouter();
  const { session } = useAuth();

  // Check current subscription status
  useEffect(() => {
    if (session?.user?.subscription?.isActive) {
      setCurrentSubscription({
        plan: session.user.subscription.plan,
        isActive: session.user.subscription.isActive
      });
    } else if (session) {
      // Fetch latest subscription data to ensure it's current
      const fetchLatestSubscription = async () => {
        try {
          const response = await fetch('/api/user/subscription');
          if (response.ok) {
            const data = await response.json();
            if (data.subscription?.isActive) {
              setCurrentSubscription({
                plan: data.subscription.plan,
                isActive: data.subscription.isActive
              });
            }
          }
        } catch (error) {
          console.error('Error fetching subscription status:', error);
        }
      };
      fetchLatestSubscription();
    }
  }, [session]);

  const handleSelectPlan = async (cycle: BillingCycle) => {
    try {
      setIsLoading(cycle);
      
      // If user is not logged in, redirect to login page
      if (!session) {
        router.push(`/auth/signin?callbackUrl=/pricing`);
        return;
      }

      // If user already has an active subscription and is attempting to switch plans
      if (currentSubscription?.isActive) {
        // For plan switching, redirect to the account page or portal
        const response = await fetch('/api/stripe/create-portal-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            flow: 'plan_change',
            returnTo: '/pricing'
          }),
        });
        
        const { url } = await response.json();
        
        if (url) {
          router.push(url);
        } else {
          console.error('Failed to create portal session');
          setIsLoading(null);
        }
        return;
      }

      // Create checkout session for new subscription
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: cycle }),
      });

      const { url } = await response.json();
      
      if (url) {
        // Redirect to Stripe checkout
        router.push(url);
      } else {
        console.error('Failed to create checkout session');
        setIsLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsLoading(null);
    }
  };

  const plans: Array<{
    cycle: BillingCycle;
    name: string;
    price: number;
    period: string;
    description: string;
    billingNote: string;
    features: Array<{ text: string; included: boolean }>;
    isPopular: boolean;
    cta: string;
    savings?: string;
  }> = [
    {
      cycle: 'monthly',
      name: 'Monthly Plan',
      price: 15,
      period: 'mo',
      description: 'Perfect for short-term needs',
      billingNote: 'Billed monthly',
      features,
      isPopular: false,
      cta: 'Get Started',
    },
    {
      cycle: 'quarterly',
      name: 'Quarterly Plan',
      price: 12,
      period: 'mo',
      description: 'Most popular choice',
      billingNote: 'Billed $36 every 3 months',
      savings: 'Save 20%',
      features,
      isPopular: true,
      cta: 'Get Started Now',
    },
    {
      cycle: 'yearly',
      name: 'Annual Plan',
      price: 10,
      period: 'mo',
      description: 'Best value for serious applicants',
      billingNote: 'Billed $120 annually',
      savings: 'Save 33%',
      features,
      isPopular: false,
      cta: 'Get Started',
    },
  ];

  // If user has an active subscription, show a message and alternative UI
  if (currentSubscription?.isActive) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Current Subscription</span>
          <h1>You Already Have an Active Subscription</h1>
          <p>You&apos;re currently on the {currentSubscription.plan ? 
              (currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)) : 'Professional'} Plan</p>
        </div>

        <div className={styles.subscriptionMessage}>
          <p>To manage your subscription, including upgrading or downgrading your plan, please visit your account page.</p>
          
          <div className={styles.actionButtons}>
            <Link href="/account" className={styles.primaryButton}>
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Professional Plan</span>
        <h1>Choose Your Billing Cycle</h1>
        <p>All plans include all features, pick the duration that works for you</p>
      </div>

      <div className={styles.plansContainer}>
        {plans.map((plan) => (
          <div
            key={plan.cycle}
            className={clsx(styles.plan, {
              [styles.popular]: plan.isPopular,
            })}
          >
            {plan.isPopular && <span className={styles.popularBadge}>Most Popular</span>}
            {plan.savings && <span className={styles.savingsBadge}>{plan.savings}</span>}
            <div className={styles.planHeader}>
              <h3>{plan.name}</h3>
              <p className={styles.description}>{plan.description}</p>
              <button 
                className={clsx(styles.button, {
                  [styles.loading]: isLoading === plan.cycle
                })}
                onClick={() => handleSelectPlan(plan.cycle)}
                disabled={isLoading !== null}
              >
                {isLoading === plan.cycle ? 'Processing...' : plan.cta}
                {isLoading !== plan.cycle && <span className={styles.buttonIcon}>→</span>}
              </button>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.cycle}>/{plan.period}</span>
              </div>
              <p className={styles.billingNote}>{plan.billingNote}</p>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className={styles.checkmark}>✓</span>
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
