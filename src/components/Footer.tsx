import { Mail, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          © 2026 Sathyanand N S. Built with Python, Machine Learning, Cloud Computing, and curiosity.
        </p>

        <div className="footer-links">
          <a href="https://github.com/Sathyanandns" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon size={16} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/sathyanand-n-s-0759a4254" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon size={16} /> LinkedIn
          </a>
          <a href="mailto:sathyanandns0342@gmail.com" aria-label="Email">
            <Mail size={16} /> Email
          </a>
          <a href="/Sathyanand_NS_Resume.pdf" download aria-label="Download Resume">
            <FileText size={16} /> Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
