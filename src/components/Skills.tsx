import { useInView } from '../hooks/useInView';
import { skillCategories } from '../data/skills';
import {
  Code,
  Brain,
  Cloud,
  Database,
  Wrench,
  Terminal,
  Layers,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  code: <Code size={20} />,
  brain: <Brain size={20} />,
  cloud: <Cloud size={20} />,
  database: <Database size={20} />,
  wrench: <Wrench size={20} />,
  terminal: <Terminal size={20} />,
};

export default function Skills() {
  const { ref, isInView } = useInView();

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <Layers size={14} /> Technical Skills
          </span>
          <h2 className="section-title">Technologies I Work With</h2>
          <p className="section-subtitle">
            Tools and technologies I use to build ML models, cloud infrastructure, and data solutions.
          </p>
        </div>

        <div className="skills-grid stagger">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              className={`skill-category-card animate-in ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="skill-category-header">
                <div className="skill-category-icon">
                  {iconMap[category.icon] || <Code size={20} />}
                </div>
                <h3 className="skill-category-title">{category.title}</h3>
              </div>
              <div className="skill-badges">
                {category.skills.map((skill) => (
                  <span key={skill} className="tech-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
