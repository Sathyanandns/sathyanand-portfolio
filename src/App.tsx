import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';

// Performance: Lazy-load below-the-fold sections
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const TeamQualities = lazy(() => import('./components/TeamQualities'));
const Languages = lazy(() => import('./components/Languages'));
const Resume = lazy(() => import('./components/Resume'));
const Contact = lazy(() => import('./components/Contact'));

function SectionFallback() {
  return (
    <div className="section-loading-skeleton" aria-hidden="true">
      <div className="skeleton-line" />
      <div className="skeleton-box" />
    </div>
  );
}

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Accessibility: Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <About />

        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Education />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <TeamQualities />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Languages />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Resume />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Footer />

      {/* UX Polish: Back to Top Floating Button */}
      <button
        type="button"
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top of page"
        title="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
