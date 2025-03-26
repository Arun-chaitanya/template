'use client';

import { DocumentNavigation } from '@/components/documents/DocumentNavigation';
import { useAuth } from '@/hooks/useAuth';

import styles from './documents.module.scss';

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth({ required: true });
  const isSubscribed = session?.user?.subscription?.isActive;

  return (
    <div className={styles.layout}>
      {isSubscribed && <DocumentNavigation />}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
