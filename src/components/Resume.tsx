import { useInView } from '../hooks/useInView';
import { Download, Eye, FileText } from 'lucide-react';

export default function Resume() {
  const { ref, isInView } = useInView();

  return (
    <section className="section resume-section">
      <div className="container">
        <div className={`section-header animate-in ${isInView ? 'visible' : ''}`} ref={ref}>
          <span className="section-label">
            <FileText size={14} /> Resume
          </span>
          <h2 className="section-title">My Resume</h2>
          <p className="section-subtitle">
            Download or view my complete resume with education, skills, and project details.
          </p>
        </div>

        <div className={`resume-actions animate-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
          <a href="./Sathyanand_NS_Resume.pdf" download className="btn btn-primary">
            <Download size={18} /> Download Resume
          </a>
          <a
            href="./Sathyanand_NS_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Eye size={18} /> View Resume
          </a>
        </div>

        <div className={`resume-highlights animate-in ${isInView ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
          <div className="resume-highlight-card">
            <h4>Education</h4>
            <ul>
              <li>MCA — KGISL Institute of Information Management (2023–2025)</li>
              <li>B.Sc Computer Science — KG Arts and Science College (2020–2023)</li>
            </ul>
          </div>

          <div className="resume-highlight-card">
            <h4>Core Skills</h4>
            <ul>
              <li>Python &amp; Machine Learning</li>
              <li>AWS Cloud (EC2, S3, IAM)</li>
              <li>Data Processing &amp; ETL</li>
              <li>Flask &amp; REST APIs</li>
            </ul>
          </div>

          <div className="resume-highlight-card">
            <h4>Project Highlights</h4>
            <ul>
              <li>Phishing Detection ML System (99.57% accuracy)</li>
              <li>ML Model Deployment on AWS</li>
              <li>Cloud Data Processing Pipeline</li>
              <li>Project Monitor &amp; EVM Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
