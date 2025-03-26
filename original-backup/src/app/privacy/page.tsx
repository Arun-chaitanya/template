import styles from './page.module.scss';

export const metadata = {
  title: 'Privacy Policy | WriteFast',
  description: 'Privacy Policy for the WriteFast application',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className={styles.legalDisclaimer}>
          Please read this privacy policy carefully to understand how we handle your personal information.
        </div>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to WriteFast. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>
        
        <section>
          <h2>2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped as follows:</p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback, and survey responses.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
            <li><strong>Document Data</strong> includes the content of any documents you create or upload to our platform.</li>
          </ul>
        </section>
        
        <section>
          <h2>3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To register you as a new customer.</li>
            <li>To provide and manage your account.</li>
            <li>To provide you with the services you have requested from us.</li>
            <li>To improve our website, products, and services.</li>
            <li>To recommend products or services which may interest you.</li>
            <li>To comply with a legal or regulatory obligation.</li>
          </ul>
        </section>
        
        <section>
          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally 
            lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your 
            personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>
        
        <section>
          <h2>5. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </section>
        
        <section>
          <h2>6. Third-Party Services</h2>
          <p>
            We may use third-party services, such as Google Analytics, Stripe for payment processing, and cloud storage providers. 
            These services may collect, use, and share your information according to their own privacy policies.
          </p>
        </section>
        
        <section>
          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new 
            privacy policy on this page and updating the &ldquo;last updated&rdquo; date at the top of this privacy policy.
          </p>
        </section>
        
        <section>
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at: 
            <a href="mailto:arunchaitanya.iitkgp@gmail.com">arunchaitanya.iitkgp@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
} 