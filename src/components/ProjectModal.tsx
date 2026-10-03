import { X, ArrowRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { useEffect } from 'react';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Problem */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span>📌</span> Problem
            </h3>
            <p>{project.problem}</p>
          </div>

          {/* Solution */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span>💡</span> Solution
            </h3>
            <p>{project.solution}</p>
          </div>

          {/* Architecture / Pipeline */}
          {project.pipeline && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <span>🔄</span> Pipeline
              </h3>
              <div className="modal-pipeline">
                {project.pipeline.map((step, i) => (
                  <span key={step}>
                    <span className="pipeline-step">{step}</span>
                    {i < project.pipeline!.length - 1 && (
                      <span className="pipeline-arrow"> <ArrowRight size={14} /> </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.architecture && (
            <div className="modal-section">
              <h3 className="modal-section-title">
                <span>🏗️</span> Architecture
              </h3>
              <div className="modal-architecture">
                {project.architecture.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {/* Metric */}
          {project.metric && (
            <div className="modal-section">
              <div className="project-metric">
                <div>
                  <div className="project-metric-value">{project.metric.value}</div>
                  <div className="project-metric-label">{project.metric.label}</div>
                </div>
                <div className="project-metric-note">{project.metric.note}</div>
              </div>
            </div>
          )}

          {/* Key Features */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span>✨</span> Key Features
            </h3>
            <ul className="modal-features-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span>🛠️</span> Technologies
            </h3>
            <div className="modal-tech-list">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span>🎯</span> Result
            </h3>
            <p>{project.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
