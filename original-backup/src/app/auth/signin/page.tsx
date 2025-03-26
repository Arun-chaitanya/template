'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import styles from './SignIn.module.scss';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn('email', { 
        email, 
        callbackUrl: '/',
        redirect: false,
      });
      // Show success message or redirect to verify page
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to WriteFast</p>
        </div>

        <div className={styles.providers}>
          <button 
            className={styles.googleButton} 
            onClick={handleGoogleSignIn}
          >
            <FcGoogle />
            <span>Continue with Google</span>
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form onSubmit={handleEmailSignIn}>
            <div className={styles.inputGroup}>
              <MdEmail className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className={styles.emailButton}
              disabled={isLoading}
            >
              {isLoading ? 'Sending link...' : 'Continue with Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 