import styles from '../privacy/page.module.scss';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team',
};

export default function ContactPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'App';
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Contact Us</h1>
        <p className={styles.lastUpdated}>We&apos;re here to help</p>
        
        <div className={styles.legalDisclaimer}>
          Have questions or need assistance? We&apos;re just an email away.
        </div>
        
        <section>
          <h2>1. Get in Touch</h2>
          <p>
            We value your feedback and are ready to assist with any questions or concerns you may have about {appName}.
            Our team is committed to providing timely and helpful responses.
          </p>
        </section>
        
        <section>
          <h2>2. Email Us</h2>
          <p>
            For any inquiries related to our service, please email us at:
          </p>
          <div className={styles.emailContainer}>
            <a href="mailto:support@example.com" className={styles.emailButton}>
              support@example.com
            </a>
          </div>
          <p>
            We typically respond to all inquiries within 24-48 hours during business days.
          </p>
        </section>
        
        <section>
          <h2>3. Support Resources</h2>
          <p>
            For your convenience, we offer several resources to help you find answers quickly:
          </p>
          <div className={styles.resourceLinks}>
            <a href="/privacy" className={styles.resourceLink}>Privacy Policy</a>
            <a href="/terms" className={styles.resourceLink}>Terms of Service</a>
            <a href="/refund" className={styles.resourceLink}>Refund Policy</a>
          </div>
        </section>
        
        <section>
          <h2>4. Subscription Support</h2>
          <p>
            If you&apos;re experiencing issues with your subscription or wish to request a refund, please provide:
          </p>
          <ul>
            <li>Your full name</li>
            <li>The email address associated with your account</li>
            <li>Details of the issue you&apos;re experiencing</li>
            <li>Any error messages you&apos;ve encountered</li>
          </ul>
          <p>
            This information helps us address your concerns more efficiently.
          </p>
        </section>
        
        <section className={styles.feedbackSection}>
          <h2>5. Feedback</h2>
          <p>
            We&apos;re constantly working to improve {appName}, and your feedback is invaluable to us.
            If you have suggestions for new features or ways we can enhance our service, please let us know!
          </p>
          <div className={styles.emailContainer}>
            <a href="mailto:support@example.com?subject=Feedback" className={styles.contactButton}>
              Send Feedback
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 