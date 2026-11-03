import { useInView } from '../hooks/useInView';
import { educationData, experienceData } from '../data/skills';
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react';

export default function Education() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: timelineRef, isInView: timelineInView } = useInView(0.1);

  return (
    <section id="education" className="section">
      <div className="container">
        {/* Experience Header */}
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <Briefcase size={14} /> Experience
          </span>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            Practical engineering internship experience contributing to robotics and technical solutions.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="education-timeline" style={{ marginBottom: '64px' }} ref={timelineRef}>
          {experienceData.map((exp, i) => (
            <div
              key={exp.role + exp.company}
              className={`education-item animate-in ${timelineInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="education-dot" />
              <div className="education-card">
                <div className="education-period">
                  <Calendar size={13} style={{ display: 'inline', marginRight: '6px' }} />
                  {exp.period} • {exp.type}
                </div>
                <h3 className="education-degree">{exp.role}</h3>
                <p className="education-institution">
                  <MapPin size={14} /> {exp.company}, {exp.location}
                </p>
                <ul
                  style={{
                    marginTop: '12px',
                    paddingLeft: '18px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    listStyleType: 'disc',
                  }}
                >
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education Header */}
        <div className={`section-header animate-in ${timelineInView ? 'visible' : ''}`}>
          <span className="section-label">
            <GraduationCap size={14} /> Education
          </span>
          <h2 className="section-title">Academic Background</h2>
          <p className="section-subtitle">
            Formal postgraduate and undergraduate degree qualifications in Computer Applications.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="education-timeline">
          {educationData.map((edu, i) => (
            <div
              key={edu.degree}
              className={`education-item animate-in ${timelineInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${(i + 1) * 150}ms` }}
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
