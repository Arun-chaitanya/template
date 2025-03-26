import React from 'react';
import styles from './Layout.module.scss';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
     <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
     
  );
}; 