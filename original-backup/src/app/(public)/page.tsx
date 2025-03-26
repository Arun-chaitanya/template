import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import styles from './page.module.scss';

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
} 