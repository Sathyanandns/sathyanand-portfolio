import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { projects } from '../data/projects';
import ProjectModal from './ProjectModal';
import type { Project } from '../data/projects';
import { FolderOpen, Star, ExternalLink } from 'lucide-react';

export default function Projects() {
  const { ref, isInView } = useInView();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <FolderOpen size={14} /> Featured Projects
          </span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-subtitle">
            End-to-end ML systems, cloud deployments, data pipelines, and project monitoring tools.
          </p>
        </div>

        <div className="projects-grid stagger">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`project-card ${project.highlight ? 'featured' : ''} animate-in ${isInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${project.title}`}
            >
              {project.highlight && (
                <span className="project-badge">
                  <Star size={12} /> Featured
                </span>
              )}

              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-description">{project.description}</p>

              {project.metric && (
                <div className="project-metric">
                  <div>
                    <div className="project-metric-value">{project.metric.value}</div>
                    <div className="project-metric-label">{project.metric.label}</div>
                  </div>
                  <div className="project-metric-note">{project.metric.note}</div>
                </div>
              )}

              <div className="project-card-tech">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="tech-badge">+{project.technologies.length - 5}</span>
                )}
              </div>

              <div className="project-card-footer">
                <button>
                  View Details <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
