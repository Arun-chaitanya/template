import { LinkButton } from '@/components/common/Button';
import styles from './HeroSection.module.scss';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Write Better Applications for US Universities</h1>
        <p>AI-powered assistant to help you craft perfect SOPs, Essays, and LORs</p>
        <div className={styles.cta}>
          <LinkButton href="/auth/signin" variant="primary">
            Get Started - Just $10
          </LinkButton>
          <LinkButton href="#features" variant="secondary">
            Learn More
          </LinkButton>
        </div>
      </div>
    </section>
  );
} 