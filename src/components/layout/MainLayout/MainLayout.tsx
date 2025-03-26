'use client';

import clsx from 'clsx';

import { useEffect, useState } from 'react';

import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';

import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Increased delay and using requestAnimationFrame for smoother transition
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setShowFooter(true);
      });
    }, 300); // Increased delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <Header />
      <main className={styles.main}>{children}</main>
      <div className={clsx(styles.footer, showFooter && styles.visible)}>
        <Footer />
      </div>
    </>
      
  );
}
