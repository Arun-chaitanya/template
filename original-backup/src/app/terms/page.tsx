import styles from '../privacy/page.module.scss';

export const metadata = {
  title: 'Terms of Service | WriteFast',
  description: 'Terms of Service for the WriteFast application',
};

export default function TermsOfServicePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className={styles.legalDisclaimer}>
          Please read these terms carefully before using our service.
        </div>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to WriteFast. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the WriteFast website and services
            (the &ldquo;Service&rdquo;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree
            with any part of the terms, you may not access the Service.
          </p>
        </section>
        
        <section>
          <h2>2. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>
        
        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of WriteFast and its licensors.
            The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product
            or service without the prior written consent of WriteFast.
          </p>
        </section>
        
        <section>
          <h2>4. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, or other material (&ldquo;Content&rdquo;).
            You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content on or through the Service, you grant us the right to use, modify, perform, display, reproduce, and distribute such Content on and through the Service.
            You retain any and all of your rights to any Content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
          </p>
        </section>
        
        <section>
          <h2>5. Subscription and Payments</h2>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring basis, depending on the type of subscription plan you select.
          </p>
          <p>
            All payments are processed securely through Stripe. By providing your payment information, you authorize us to charge your payment method for the subscription plan you have selected.
          </p>
        </section>
        
        <section>
          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or cancel your subscription.
          </p>
        </section>
        
        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall WriteFast, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
        
        <section>
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
        
        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: 
            <a href="mailto:arunchaitanya.iitkgp@gmail.com">arunchaitanya.iitkgp@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
} 