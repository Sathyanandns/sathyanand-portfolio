import { useInView } from '../hooks/useInView';
import { User } from 'lucide-react';

const infoCards = [
  { label: 'Focus', value: 'Machine Learning & Cloud Computing' },
  { label: 'Primary Language', value: 'Python' },
  { label: 'Cloud', value: 'AWS' },
  { label: 'Location', value: 'Coimbatore, Tamil Nadu' },
];

export default function About() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <User size={14} /> About Me
          </span>
          <h2 className="section-title">Who I Am</h2>
          <p className="section-subtitle">
            A practical engineer who builds real systems at the intersection of data and infrastructure.
          </p>
        </div>

        <div className="about-grid">
          <div className={`about-image-section animate-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <img
              src="./images/sathyanand-about.jpg"
              alt="Sathyanand N S"
              className="about-image"
              loading="lazy"
            />
            <div className="about-image-accent" />
          </div>

          <div className={`about-text-section animate-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <h3>Building at the Intersection of Data &amp; Infrastructure</h3>
            
            <p>
              I recently completed my MCA with a strong focus on <strong>Machine Learning</strong> and <strong>AWS Cloud Computing</strong>, and I genuinely enjoy working at the intersection of data and infrastructure.
            </p>
            
            <p>
              Over the past couple of years, I've built and deployed ML models, worked with cloud-based data pipelines, and learned how to manage AWS resources securely.
            </p>
            
            <p>
              I take ownership of problems rather than simply writing code that runs. I care about <strong>scalability</strong>, <strong>maintainability</strong>, <strong>security</strong>, and whether a solution actually solves the right problem.
            </p>

            <div className="about-info-cards stagger">
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  className={`about-info-card animate-in ${isInView ? 'visible' : ''}`}
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
