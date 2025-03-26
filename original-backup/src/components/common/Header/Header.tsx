'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './Header.module.scss';

export function Header() {
  const { session, isLoading } = useAuth({ required: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | undefined>(undefined);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const userInitial = session?.user?.name?.[0] || session?.user?.email?.[0] || '?';
  
  // Fetch latest subscription status
  useEffect(() => {
    if (session) {
      // First set based on session data (faster initial UI)
      setHasActiveSubscription(session.user?.subscription?.isActive);
      
      // Then fetch the latest data
      const fetchSubscription = async () => {
        try {
          const response = await fetch('/api/user/subscription');
          if (response.ok) {
            const data = await response.json();
            setHasActiveSubscription(data.subscription?.isActive);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      };
      
      fetchSubscription();
    } else {
      setHasActiveSubscription(false);
    }
  }, [session]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          WriteFast
        </Link>

        <nav className={styles.nav}>
          {session && <Link href="/documents">My Documents</Link>}
          
          {isLoading ? (
            <div className={styles.skeleton} />
          ) : session ? (
            // If user is logged in
            <>
              {hasActiveSubscription ? (
                <Link href="/account">Account</Link>
              ) : (
                <Link href="/pricing">Pricing</Link>
              )}
              
              <div className={styles.userMenu}>
                <button 
                  className={styles.profileButton} 
                  onClick={toggleMenu}
                  title={session.user.name || session.user.email || 'Menu'}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Profile'}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {userInitial.toUpperCase()}
                    </div>
                  )}
                  <span className={styles.userName}>
                    {session.user.name?.split(' ')[0]}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.userInfo}>
                      <p className={styles.name}>{session.user.name}</p>
                      <p className={styles.email}>{session.user.email}</p>
                    </div>
                    
                    <div className={styles.menuItems}>
                      {hasActiveSubscription && (
                        <Link href="/account" className={styles.menuItem}>
                          Manage Subscription
                        </Link>
                      )}
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={styles.signOutButton}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // If user is not logged in
            <>
              <Link href="/pricing">Pricing</Link>
              <div className={styles.auth}>
                <Link href="/auth/signin" className={styles.signIn}>
                  Sign In
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
