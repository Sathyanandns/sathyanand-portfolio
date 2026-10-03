import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import TeamQualities from './components/TeamQualities';
import Languages from './components/Languages';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <TeamQualities />
        <Languages />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
