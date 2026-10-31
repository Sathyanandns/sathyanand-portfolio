import { useInView } from '../hooks/useInView';
import { Download, Eye, FileText } from 'lucide-react';
import { siteConfig, assetUrl } from '../data/site';

export default function Resume() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: bodyRef, isInView: bodyInView } = useInView(0.1);

  const resumeHref = assetUrl(siteConfig.resumeFile);

  return (
    <section id="resume" className="section resume-section">
      <div className="container">
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <FileText size={14} /> Resume
          </span>
          <h2 className="section-title">My Resume</h2>
          <p className="section-subtitle">
            Download or view my complete resume detailing education, technical proficiencies, and project outcomes.
          </p>
        </div>

        <div
          ref={bodyRef}
          className={`resume-actions animate-in ${bodyInView ? 'visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          <a
            href={resumeHref}
            download
            className="btn btn-primary"
            aria-label="Download Sathyanand N S Resume PDF"
          >
            <Download size={18} /> Download Resume
          </a>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label="View Sathyanand N S Resume PDF in new tab"
          >
            <Eye size={18} /> View Resume
          </a>
        </div>

        <div
          className={`resume-highlights animate-in ${bodyInView ? 'visible' : ''}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="resume-highlight-card">
            <h3>Education</h3>
            <ul>
              <li>MCA — KGISL Institute of Information Management (2023–2025)</li>
              <li>B.Sc Computer Science — KG Arts and Science College (2020–2023)</li>
            </ul>
          </div>

          <div className="resume-highlight-card">
            <h3>Core Skills</h3>
            <ul>
              <li>Python &amp; Machine Learning (Scikit-Learn, XGBoost)</li>
              <li>AWS Cloud Computing (EC2, S3, IAM, SageMaker)</li>
              <li>Data Processing &amp; ETL Pipelines (Pandas, NumPy)</li>
              <li>Backend &amp; API Development (Flask, REST APIs)</li>
            </ul>
          </div>

          <div className="resume-highlight-card">
            <h3>Project Highlights</h3>
            <ul>
              <li>Phishing Detection ML System (99.57% test accuracy)</li>
              <li>ML Model Cloud Deployment on AWS EC2 &amp; S3</li>
              <li>Automated Cloud Data Processing Pipeline (85% time reduction)</li>
              <li>Project Monitor &amp; EVM Milestone Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
