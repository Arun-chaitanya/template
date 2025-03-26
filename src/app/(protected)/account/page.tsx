import { SubscriptionManagement } from '@/components/account/SubscriptionManagement';
import styles from './page.module.scss';

export default function AccountPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your account settings and subscription</p>
      </div>

      <div className={styles.section}>
        <SubscriptionManagement />
      </div>

      {/* Additional account sections like profile, password, etc. can be added here */}
    </div>
  );
} 