'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

import styles from './DocumentsOverview.module.scss';

type DocumentStatus = 'not-started' | 'in-progress' | 'completed';

interface DocumentItem {
  title: string;
  path: string;
  status?: DocumentStatus;
  count?: number;
}

interface DocumentSection {
  title: string;
  path: string;
  items: DocumentItem[];
}

export function DocumentsOverview() {
  const { session } = useAuth({ required: true });
  const isSubscribed = session?.user?.subscription?.isActive;

  const sections: DocumentSection[] = [
    {
      title: 'Statement of Purpose',
      path: '/documents/sop',
      items: [
        { title: 'Master SOP', path: '/documents/sop/master', status: 'not-started' },
        { title: 'University SOPs', path: '/documents/sop/university', count: 0 },
      ],
    },
    {
      title: 'Letters of Recommendation',
      path: '/documents/lor',
      items: [
        { title: 'Professor LORs', path: '/documents/lor/professor', count: 0 },
        { title: 'Company LORs', path: '/documents/lor/company', count: 0 },
        { title: 'Internship LORs', path: '/documents/lor/internship', count: 0 },
      ],
    },
    {
      title: 'Essays',
      path: '/documents/essay',
      items: [{ title: 'University Essays', path: '/documents/essay', count: 0 }],
    },
  ];

  if (!isSubscribed) {
    return (
      <div className={styles.container}>
        <div className={styles.subscriptionRequired}>
          <h1>Subscription Required</h1>
          <p>You need an active subscription to access and manage your documents. Our subscription gives you access to all document templates and AI-powered writing assistance.</p>
          <Link href="/pricing" className={styles.subscribeButton}>
            View Subscription Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>My Documents</h1>

      <div className={styles.grid}>
        {sections.map((section) => (
          <div key={section.path} className={styles.section}>
            <h2>
              <Link href={section.path}>{section.title}</Link>
            </h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className={styles.item}>
                    <span>{item.title}</span>
                    {'count' in item && <span className={styles.count}>{item.count}</span>}
                    {item.status && (
                      <span className={styles[item.status as DocumentStatus]}>{item.status}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
