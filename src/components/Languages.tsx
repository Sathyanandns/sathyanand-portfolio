import { useInView } from '../hooks/useInView';
import { languages } from '../data/skills';
import { Globe } from 'lucide-react';

export default function Languages() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: listRef, isInView: listInView } = useInView(0.1);

  return (
    <section className="section">
      <div className="container">
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <Globe size={14} /> Languages
          </span>
          <h2 className="section-title">Languages I Speak</h2>
        </div>

        <div className="languages-list stagger" ref={listRef}>
          {languages.map((lang, i) => (
            <div
              key={lang.name}
              className={`language-card animate-in ${listInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="language-name">{lang.name}</div>
              <div className="language-level">{lang.level}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
