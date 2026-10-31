import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { projects, type Project, type ProjectCategory } from '../data/projects';
import ProjectModal from './ProjectModal';
import { FolderOpen, Star, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import { assetUrl } from '../data/site';

const categories: ProjectCategory[] = ['All', 'ML', 'AWS', 'Data'];

function ProjectCardItem({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <article
      ref={ref}
      className={`project-card ${project.highlight ? 'featured' : ''} animate-in ${isInView ? 'visible' : ''}`}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(project);
        }
      }}
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
    >
      <div className="project-card-header">
        <span className="project-category-badge">{project.category}</span>
        {project.highlight && (
          <span className="project-badge">
            <Star size={12} /> Featured
          </span>
        )}
      </div>

      {/* Architecture / Preview thumbnail for featured projects */}
      {project.highlight && project.architectureImage && (
        <div className="project-card-image-wrap">
          <img
            src={assetUrl(project.architectureImage)}
            alt={project.architectureImageAlt || `${project.title} diagram`}
            loading="lazy"
            className="project-card-thumb"
            width={400}
            height={225}
          />
        </div>
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
        <button
          type="button"
          className="project-btn-details"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project);
          }}
          aria-label={`View details of ${project.title}`}
        >
          View Details <ExternalLink size={14} />
        </button>

        <div className="project-links-row">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-icon"
              aria-label={`${project.title} GitHub repository`}
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon size={16} /> Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-icon"
              aria-label={`${project.title} Live Demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} /> Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');

  const filteredProjects = projects.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <FolderOpen size={14} /> Featured Projects
          </span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-subtitle">
            End-to-end ML systems, cloud deployments, data pipelines, and project monitoring tools.
          </p>

          {/* Category Filter Bar */}
          <div className="project-filter-bar" role="tablist" aria-label="Project filter tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span className="filter-count">
                  {cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid stagger">
          {filteredProjects.map((project) => (
            <ProjectCardItem
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
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
