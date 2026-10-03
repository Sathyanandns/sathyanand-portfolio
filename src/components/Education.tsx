import { useInView } from '../hooks/useInView';
import { educationData } from '../data/skills';
import { GraduationCap, MapPin } from 'lucide-react';

export default function Education() {
  const { ref, isInView } = useInView();

  return (
    <section id="education" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <GraduationCap size={14} /> Education
          </span>
          <h2 className="section-title">Academic Background</h2>
        </div>

        <div className="education-timeline">
          {educationData.map((edu, i) => (
            <div
              key={edu.degree}
              className={`education-item animate-in ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="education-dot" />
              <div className="education-card">
                <div className="education-period">{edu.period}</div>
                <h3 className="education-degree">{edu.degree}</h3>
                <p className="education-institution">
                  <MapPin size={14} /> {edu.institution}, {edu.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
