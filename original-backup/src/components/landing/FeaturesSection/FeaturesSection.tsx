import styles from './FeaturesSection.module.scss';

export function FeaturesSection() {
  const features = [
    {
      title: 'Master SOP Builder',
      description: 'Create a foundation SOP that adapts to each university application'
    },
    {
      title: 'Multiple LOR Types',
      description: 'Generate letters from professors, employers, and internship supervisors'
    },
    {
      title: 'University Essays',
      description: "Craft unique essays tailored to each university's requirements"
    },
    {
      title: 'AI-Powered Writing',
      description: 'Get intelligent suggestions and improvements for your content'
    }
  ];

  return (
    <section className={styles.features} id="features">
      <h2>Everything You Need</h2>
      <div className={styles.grid}>
        {features.map((feature, i) => (
          <div key={i} className={styles.feature}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 