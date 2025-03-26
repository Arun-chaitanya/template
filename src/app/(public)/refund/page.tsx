import styles from '../privacy/page.module.scss';

export const metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for the application',
};

export default function RefundPolicyPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'App';
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Refund Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className={styles.legalDisclaimer}>
          Please read this refund policy carefully before subscribing to our service.
        </div>
        
        <section>
          <h2>1. Refund Policy</h2>
          <p>
            At {appName}, we stand behind the quality of our service and want you to be completely satisfied with your subscription. 
            We offer refunds under the following conditions:
          </p>
          <ul>
            <li>For annual subscriptions, you may request a prorated refund for the unused portion of your subscription.</li>
            <li>For monthly subscriptions, you may request a full refund if you haven&apos;t extensively used the service.</li>
            <li>Refund requests must be made within 7 days of the initial purchase or renewal date.</li>
          </ul>
        </section>
        
        <section>
          <h2>2. How to Request a Refund</h2>
          <p>
            To request a refund, please email us at <a href="mailto:support@example.com">support@example.com</a> with the following information:
          </p>
          <ul>
            <li>Your full name</li>
            <li>The email address associated with your account</li>
            <li>Date of purchase</li>
            <li>Reason for the refund request</li>
          </ul>
          <p>
            We will review your request and respond within 2-3 business days. If your refund is approved, it will be processed to the original payment method used for the purchase.
          </p>
        </section>
        
        <section>
          <h2>3. Contact Information</h2>
          <p>
            If you have any questions about our refund policy, please contact us at: 
            <a href="mailto:support@example.com">support@example.com</a>
          </p>
        </section>
      </div>
    </div>
  );
} 