import {
  ArrowRight,
  Download,
  MessageCircle,
  Cloud,
  Brain,
  Code,
  Sparkles,
} from 'lucide-react';
import { siteConfig, assetUrl } from '../data/site';

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* Background decoration */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-gradient-orb blue" />
        <div className="hero-gradient-orb purple" />
        <div className="hero-gradient-orb cyan" />
      </div>

      <div className="hero-content">
        {/* Text */}
        <div className="hero-text hero-fade-in">
          {/* Currently / Status Pill */}
          <div className="hero-currently-banner">
            <span className="currently-pulse" />
            <Sparkles size={14} className="currently-icon" />
            <span>{siteConfig.currentStatus}</span>
          </div>

          <div className="hero-status">
            <span className="status-dot" />
            Python &bull; Machine Learning &bull; AWS &bull; Cloud Computing
          </div>

          <h1 className="hero-name">
            <span>{siteConfig.firstName}</span>
            <span className="first-name">{siteConfig.lastName}</span>
          </h1>

          <p className="hero-title">
            <span className="title-divider" />
            {siteConfig.title}
          </p>

          <p className="hero-description">
            {siteConfig.heroDescription}
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View My Projects <ArrowRight size={18} />
            </a>
            <a
              href={assetUrl(siteConfig.resumeFile)}
              download
              className="btn btn-secondary"
            >
              <Download size={18} /> Download Resume
            </a>
          </div>

          <a href="#contact" className="btn btn-ghost">
            <MessageCircle size={16} /> Let&apos;s Connect
          </a>

          <div className="hero-tech-stack">
            <span>Python</span>
            <span className="divider">•</span>
            <span>Machine Learning</span>
            <span className="divider">•</span>
            <span>AWS Cloud</span>
            <span className="divider">•</span>
            <span>Data Pipelines</span>
          </div>
        </div>

        {/* Image */}
        <div
          className="hero-image-wrapper hero-fade-in"
          style={{ animationDelay: '150ms' }}
        >
          <div className="hero-image-container">
            <div className="hero-image-glow" />
            <picture>
              <source srcSet={assetUrl('images/sathyanand-hero.webp')} type="image/webp" />
              <img
                className="hero-image"
                src={assetUrl('images/sathyanand-hero.jpg')}
                alt={`${siteConfig.name} - ${siteConfig.title}`}
                loading="eager"
                width={380}
                height={420}
                fetchPriority="high"
              />
            </picture>

            {/* Floating badges */}
            <div className="hero-floating-card card-1">
              <Brain size={14} className="card-icon" />
              <span>ML Engineer</span>
            </div>
            <div className="hero-floating-card card-2">
              <Cloud size={14} className="card-icon" />
              <span>AWS Cloud</span>
            </div>
            <div className="hero-floating-card card-3">
              <Code size={14} className="card-icon" />
              <span>Python &amp; Data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
