import { useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ParticleCanvas } from './components/ParticleCanvas';
import { NotFound } from './components/NotFound';
import { useRole } from './utils/RoleContext';
import { FloatingConsole } from './components/FloatingConsole';

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { transitionStatus } = useRole();

  const heroGlowRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      }
      
      // Cache the hero-glow element query once to prevent high-frequency DOM lookups
      if (!heroGlowRef.current) {
        heroGlowRef.current = document.querySelector('.hero-glow') as HTMLElement;
      }
      
      if (heroGlowRef.current) {
        const hX = (e.clientX - window.innerWidth / 2) * 0.05;
        const hY = (e.clientY - window.innerHeight / 2) * 0.05;
        heroGlowRef.current.style.transform = `translate3d(calc(-50% + ${hX}px), calc(-50% + ${hY}px), 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    const statCounters = document.querySelectorAll('.stat-counter');
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
          let current = 0;
          const increment = Math.ceil(target / 40);

          const countUp = () => {
            if (current < target) {
              current = Math.min(current + increment, target);
              entry.target.innerHTML = current.toString();
              setTimeout(countUp, 30);
            }
          };
          countUp();
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statCounters.forEach(counter => countObserver.observe(counter));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  // Simple, lightweight client-side routing for unrecognized paths
  const isNotFound = window.location.pathname !== '/' && 
                     window.location.pathname !== '' && 
                     window.location.pathname !== '/index.html';

  const transitionClass = transitionStatus === 'fading-out'
    ? 'opacity-0 scale-[0.98] blur-[2px] transition-all duration-200 ease-out'
    : transitionStatus === 'fading-in'
    ? 'opacity-0 scale-[0.98] blur-[2px] transition-all duration-300 ease-in'
    : 'opacity-100 scale-100 blur-0 transition-all duration-300 ease-in-out';

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <div className="grid-background"></div>
      <ParticleCanvas />
      <div className="cursor-glow" id="cursorGlow" ref={cursorRef}></div>

      <Navbar />

      <main className="relative pt-20">
        {isNotFound ? (
          <NotFound />
        ) : (
          <div className={transitionClass}>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Education />
            <Contact />
          </div>
        )}
      </main>

      <Footer />
      <FloatingConsole />
    </div>
  );
}

export default App;
