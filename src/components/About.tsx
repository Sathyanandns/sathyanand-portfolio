import { useInView } from '../hooks/useInView';
import { User } from 'lucide-react';
import { siteConfig, assetUrl } from '../data/site';

const infoCards = [
  { label: 'Focus', value: 'Machine Learning & Cloud Computing' },
  { label: 'Primary Language', value: 'Python' },
  { label: 'Cloud Architecture', value: 'AWS (EC2, S3, IAM)' },
  { label: 'Location', value: siteConfig.location },
];

export default function About() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: contentRef, isInView: contentInView } = useInView(0.1);

  return (
    <section id="about" className="section">
      <div className="container">
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <User size={14} /> About Me
          </span>
          <h2 className="section-title">Who I Am</h2>
          <p className="section-subtitle">
            A practical engineer who builds real systems at the intersection of data and infrastructure.
          </p>
        </div>

        <div className="about-grid" ref={contentRef}>
          <div
            className={`about-image-section animate-in ${contentInView ? 'visible' : ''}`}
            style={{ transitionDelay: '100ms' }}
          >
            <picture>
              <source srcSet={assetUrl('images/sathyanand-about.webp')} type="image/webp" />
              <img
                src={assetUrl('images/sathyanand-about.jpg')}
                alt={`${siteConfig.name} working on cloud and machine learning systems`}
                className="about-image"
                loading="lazy"
                width={420}
                height={560}
              />
            </picture>
            <div className="about-image-accent" aria-hidden="true" />

            {/* Profile Avatar Showcase Badge */}
            <div className="about-profile-badge">
              <picture>
                <source srcSet={assetUrl('images/sathyanand-profile.webp')} type="image/webp" />
                <img
                  src={assetUrl('images/sathyanand-profile.jpg')}
                  alt={`${siteConfig.name} profile portrait`}
                  className="about-profile-avatar"
                  loading="lazy"
                  width={48}
                  height={48}
                />
              </picture>
              <div className="about-profile-info">
                <span className="profile-badge-name">{siteConfig.name}</span>
                <span className="profile-badge-role">ML &amp; Cloud Engineer</span>
              </div>
            </div>
          </div>

          <div
            className={`about-text-section animate-in ${contentInView ? 'visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3>Building at the Intersection of Data &amp; Infrastructure</h3>

            <p>
              I recently completed my MCA with a strong focus on <strong>Machine Learning</strong> and{' '}
              <strong>AWS Cloud Computing</strong>, and I genuinely enjoy working at the intersection of
              data and cloud infrastructure.
            </p>

            <p>
              Over the past couple of years, I've built and deployed ML models, engineered cloud-based ETL pipelines,
              and managed AWS infrastructure with strict security and IAM least-privilege standards.
            </p>

            <p>
              I take ownership of engineering problems from development to cloud hosting. I prioritize{' '}
              <strong>scalability</strong>, <strong>maintainability</strong>, <strong>security</strong>, and
              delivering solutions that measurably solve real business problems.
            </p>

            <div className="about-info-cards stagger">
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  className={`about-info-card animate-in ${contentInView ? 'visible' : ''}`}
                >
                  <div className="card-label">{card.label}</div>
                  <div className="card-value">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
