import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  loadingText?: string;
}

interface LinkButtonProps extends ButtonProps {
  href: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  onClick, 
  disabled,
  type = 'button',
  isLoading = false,
  loadingText = 'Loading...'
}: ButtonProps) {
  return (
    <button 
      type={type}
      className={clsx(styles.button, styles[variant], className)}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

export function LinkButton({ href, children, variant = 'primary', className }: LinkButtonProps) {
  return (
    <Link 
      href={href} 
      className={clsx(styles.button, styles[variant], className)}
    >
      {children}
    </Link>
  );
} 