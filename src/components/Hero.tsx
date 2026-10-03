import { useInView } from '../hooks/useInView';
import {
  ArrowRight,
  Download,
  MessageCircle,
  Cloud,
  Brain,
  Code,
} from 'lucide-react';

export default function Hero() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="home" className="hero" ref={ref}>
      {/* Background */}
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-gradient-orb blue" />
        <div className="hero-gradient-orb purple" />
        <div className="hero-gradient-orb cyan" />
      </div>

      <div className="hero-content">
        {/* Text */}
        <div className={`hero-text animate-in ${isInView ? 'visible' : ''}`}>
          <div className="hero-status">
            <span className="status-dot" />
            Python &bull; Machine Learning &bull; AWS &bull; Cloud Computing
          </div>

          <h1 className="hero-name">
            <span>Sathyanand</span>
            <span className="first-name">N S</span>
          </h1>

          <p className="hero-title">
            <span className="title-divider" />
            Machine Learning &amp; Cloud Computing Engineer
          </p>

          <p className="hero-description">
            Building practical machine learning solutions, cloud-based systems,
            data pipelines, and automation with Python and AWS.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View My Projects <ArrowRight size={18} />
            </a>
            <a
              href="/Sathyanand_NS_Resume.pdf"
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
            <span>AWS</span>
            <span className="divider">•</span>
            <span>Cloud Computing</span>
          </div>
        </div>

        {/* Image */}
        <div
          className={`hero-image-wrapper animate-in ${isInView ? 'visible' : ''}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="hero-image-container">
            <div className="hero-image-glow" />
            <img
              className="hero-image"
              src="/images/sathyanand-hero.jpg"
              alt="Sathyanand N S"
              loading="eager"
              width={380}
              height={420}
            />
            {/* Floating cards */}
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
              <span>Python</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
