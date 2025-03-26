'use client';

import clsx from 'clsx';

import { JSX } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './DocumentNavigation.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    label: 'Statement of Purpose',
    href: '/documents/sop',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
      </svg>
    ),
  },
  {
    label: 'Letter of Recommendation',
    href: '/documents/lor',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.7L12 13 4 8.7V6l8 4.3L20 6v2.7z" />
      </svg>
    ),
  },
  {
    label: 'Essays',
    href: '/documents/essay',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
        <path d="M13.17 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.83L13.17 2zM15 18H9v-2h6v2zm4-4H9v-2h10v2zm0-4H9V8h10v2z" />
      </svg>
    ),
  },
];

export function DocumentNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navList}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(styles.navLink, isActive && styles.active)}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
