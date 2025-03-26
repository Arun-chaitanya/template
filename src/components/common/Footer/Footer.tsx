'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import styles from './Footer.module.scss';

export function Footer() {
  const { session, isLoading } = useAuth({ required: false });
  const currentYear = new Date().getFullYear();
  const isSubscribed = session?.user?.subscription?.isActive;

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>WriteFast</h3>
            <p>AI-powered writing assistant for your university applications. Get into your dream US university with compelling SOPs, LORs, and Essays.</p>
          </div>
          
          <div className={styles.links}>
            <h4>Quick Links</h4>
            <nav>
              <Link href="/documents/sop">Statement of Purpose</Link>
              <Link href="/documents/lor">Letters of Recommendation</Link>
              <Link href="/documents/essay">Essays</Link>
              {!isLoading && (
                isSubscribed ? (
                  <Link href="/account">Account</Link>
                ) : (
                  <Link href="/pricing">Pricing</Link>
                )
              )}
            </nav>
          </div>

          <div className={styles.links}>
            <h4>Legal</h4>
            <nav>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/refund">Refund Policy</Link>
              <Link href="/contact">Contact Us</Link>
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} WriteFast. All rights reserved.</p>
          <p>Made with ❤️ for Indian students</p>
        </div>
      </div>
    </footer>
  );
} 