
import { lazy, Suspense, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import { trackEvent } from './utils/analytics';

const InfiniteMarquee = lazy(() => import('./components/InfiniteMarquee'));
const SelectedWorks = lazy(() => import('./components/SelectedWorks'));
const ContactFooter = lazy(() => import('./components/ContactFooter'));

const SECTION_REVEAL = {
  hidden: { opacity: 0, y: 46 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 24, mass: 0.25 });

  const navItems = [
    { id: 'hero', label: 'Home', href: '#hero' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'resume', label: 'Resume', href: 'RESUME.pdf' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ] as const;

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;

      if (!anchor) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const section = document.querySelector(hash) as HTMLElement | null;
      if (!section) return;

      event.preventDefault();

      const navOffset = 100;
      const top = section.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({ top, behavior: 'smooth' });
      window.history.replaceState(null, '', hash);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  useEffect(() => {
    const sectionIds = ['hero', 'projects', 'contact'] as const;

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.45;
      let nextSection = 'hero';

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (marker >= top && marker < bottom) {
          nextSection = id;
        } else if (marker >= bottom) {
          nextSection = id;
        }
      });

      setActiveSection(nextSection);
    };

    updateActiveSection();

    let rafId = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="font-['Inter'] text-white bg-[#050505] selection:bg-[#f5c400] selection:text-black">
      <CustomCursor />

      <motion.div
        className="fixed top-0 left-0 z-[160] h-[3px] w-full origin-left bg-gradient-to-r from-[#f5c400] via-[#ffe178] to-[#f5c400] shadow-[0_0_8px_rgba(245,196,0,0.5),0_0_20px_rgba(245,196,0,0.25)]"
        style={{ scaleX: progressScaleX }}
      />
      
      {/* Navigation */}
      <nav className="flex justify-between items-center py-5 md:py-[30px] px-[5%] fixed top-0 w-full z-[100] bg-gradient-to-b from-[#050505]/88 via-[#050505]/48 to-transparent backdrop-blur-[10px] border-b border-white/[0.04] pointer-events-none">
        <a href="#hero" className="font-syne font-black text-[24px] tracking-tight text-white no-underline interactive pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">
          sujith.dev
        </a>
        <div className="hidden md:flex gap-3 pointer-events-auto">
          {navItems.map((item) => {
            const isResume = item.id === 'resume';
            const isActive = !isResume && activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                target={isResume ? '_blank' : undefined}
                rel={isResume ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  if (isResume) {
                    trackEvent('resume_click', { source: 'nav' });
                    return;
                  }
                  trackEvent('nav_click', { item: item.id });
                }}
                className={`relative text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-full px-3 py-2 ${
                  isActive ? 'text-white' : 'text-[#aaa] hover:text-[#f5c400]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full border border-[#3f3f3f] bg-white/[0.03]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.45 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-controls="mobile-nav-menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden pointer-events-auto text-[#d8d8d8] hover:text-[#f5c400] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute top-[84px] right-[5%] w-[min(280px,86vw)] rounded-2xl border border-[#2a2a2a] bg-[#0b0b0b]/95 backdrop-blur-lg md:backdrop-blur-xl p-5 flex flex-col gap-4 pointer-events-auto shadow-2xl origin-top-right"
            >
              <a href="#hero" onClick={() => { trackEvent('mobile_nav_click', { item: 'home' }); setMobileMenuOpen(false); }} className={`text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm ${activeSection === 'hero' ? 'text-[#f5c400]' : 'text-[#d3d3d3] hover:text-[#f5c400]'}`}>Home</a>
              <a href="#projects" onClick={() => { trackEvent('mobile_nav_click', { item: 'projects' }); setMobileMenuOpen(false); }} className={`text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm ${activeSection === 'projects' ? 'text-[#f5c400]' : 'text-[#d3d3d3] hover:text-[#f5c400]'}`}>Projects</a>
              <a href="RESUME.pdf" target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('resume_click', { source: 'mobile_nav' }); setMobileMenuOpen(false); }} className="text-[#d3d3d3] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm">Resume</a>
              <a href="#contact" onClick={() => { trackEvent('mobile_nav_click', { item: 'contact' }); setMobileMenuOpen(false); }} className={`text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm ${activeSection === 'contact' ? 'text-[#f5c400]' : 'text-[#d3d3d3] hover:text-[#f5c400]'}`}>Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <motion.div
          variants={SECTION_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
        >
          <Hero />
        </motion.div>

        <Suspense fallback={null}>
          <motion.div
            variants={SECTION_REVEAL}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <InfiniteMarquee />
          </motion.div>
        </Suspense>

        <Suspense fallback={null}>
          <motion.div
            variants={SECTION_REVEAL}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            <SelectedWorks />
          </motion.div>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <ContactFooter />
      </Suspense>
    </div>
  );
};

export default App;
