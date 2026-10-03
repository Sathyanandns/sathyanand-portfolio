import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-inner">
          <a href="#home" className="navbar-logo" aria-label="Home">
            <span className="logo-text">Sathyanand</span>
            <span className="logo-dot" />
          </a>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.slice(1) ? 'active' : ''}
              >
                {link.label}
              </a>
            ))}
            <a
              href="./Sathyanand_NS_Resume.pdf"
              download
              className="navbar-resume-btn"
            >
              Resume
            </a>
          </div>

          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={handleNavClick}>
            {link.label}
          </a>
        ))}
        <a
          href="./Sathyanand_NS_Resume.pdf"
          download
          className="btn btn-primary"
          onClick={handleNavClick}
        >
          Download Resume
        </a>
      </div>
    </>
  );
}
