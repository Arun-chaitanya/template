import clsx from 'clsx';

import { LinkButton } from '@/components/common/Button';

import styles from './PricingSection.module.scss';

export function PricingSection() {
  const features = [
    { text: 'Master SOP Template', included: true },
    { text: 'University-specific SOPs', included: true },
    { text: 'Multiple LOR Types', included: true },
    { text: 'University Essays', included: true },
    { text: 'AI Writing Assistant', included: true },
    { text: 'Priority Support', included: true },
  ];

  const plans = [
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

  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.header}>
        <span className={styles.badge}>Professional Plan</span>
        <h2>Choose Your Billing Cycle</h2>
        <p className={styles.subtitle}>
          All plans include all features, pick the duration that works for you
        </p>
      </div>

      <div className={styles.plansContainer}>
        {plans.map((plan, index) => (
          <div key={index} className={clsx(styles.plan, plan.isPopular && styles.popular)}>
            {plan.isPopular && <span className={styles.popularBadge}>Most Popular</span>}
            {plan.savings && <span className={styles.savingsBadge}>{plan.savings}</span>}
            <div className={styles.planHeader}>
              <h3>{plan.name}</h3>
              <p className={styles.description}>{plan.description}</p>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{plan.price}</span>
                <span className={styles.cycle}>/{plan.period}</span>
              </div>
              <p className={styles.billingNote}>{plan.billingNote}</p>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, i) => (
                <li key={i} className={feature.included ? '' : styles.disabled}>
                  <span className={styles.checkmark}>✓</span>
                  {feature.text}
                </li>
              ))}
            </ul>

            <LinkButton
              href="/auth/signin"
              variant={plan.isPopular ? 'primary' : 'secondary'}
              className={styles.ctaButton}
            >
              {plan.cta}
              <span className={styles.buttonIcon}>→</span>
            </LinkButton>
          </div>
        ))}
      </div>
    </section>
  );
}
