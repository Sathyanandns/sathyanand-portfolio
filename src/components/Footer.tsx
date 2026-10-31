import { Mail, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { siteConfig, getMailtoLink, assetUrl } from '../data/site';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          &copy; {CURRENT_YEAR} {siteConfig.name}. Built with React, TypeScript, and modern engineering practices.
        </p>

        <div className="footer-links">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={16} /> GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={16} /> LinkedIn
          </a>
          <a
            href={getMailtoLink('Portfolio Contact')}
            aria-label="Send direct email"
          >
            <Mail size={16} /> Email
          </a>
          <a
            href={assetUrl(siteConfig.resumeFile)}
            download
            aria-label="Download Resume"
          >
            <FileText size={16} /> Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
