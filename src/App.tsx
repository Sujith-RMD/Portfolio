
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import InfiniteMarquee from './components/InfiniteMarquee';
import SelectedWorks from './components/SelectedWorks';
import ContactFooter from './components/ContactFooter';
import { trackEvent } from './utils/analytics';

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
  const [appReady, setAppReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 24, mass: 0.25 });

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
    const id = window.requestAnimationFrame(() => {
      setAppReady(true);
    });

    return () => window.cancelAnimationFrame(id);
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

  return (
    <div className={`font-['Inter'] text-white bg-[#050505] selection:bg-[#f5c400] selection:text-black transition-opacity duration-700 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
      <CustomCursor />

      <motion.div
        className="fixed top-0 left-0 z-[160] h-[2px] w-full origin-left bg-gradient-to-r from-[#f5c400] via-[#ffe178] to-[#f5c400]"
        style={{ scaleX: progressScaleX }}
      />
      
      {/* Navigation */}
      <nav className="flex justify-between items-center py-5 md:py-[30px] px-[5%] fixed top-0 w-full z-[100] bg-gradient-to-b from-[#050505]/88 via-[#050505]/48 to-transparent backdrop-blur-[10px] border-b border-white/[0.04] pointer-events-none">
        <a href="#hero" className="font-syne font-black text-[24px] tracking-tight text-white no-underline interactive pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">
          sujith.dev
        </a>
        <div className="hidden md:flex gap-8 pointer-events-auto">
          <a href="#hero" onClick={() => trackEvent('nav_click', { item: 'home' })} className="text-[#aaa] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">Home</a>
          <a href="#projects" onClick={() => trackEvent('nav_click', { item: 'projects' })} className="text-[#aaa] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">Projects</a>
          <a href="RESUME.pdf" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('resume_click', { source: 'nav' })} className="text-[#aaa] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">Resume</a>
          <a href="#contact" onClick={() => trackEvent('nav_click', { item: 'contact' })} className="text-[#aaa] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm">Contact</a>
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
              <a href="#hero" onClick={() => { trackEvent('mobile_nav_click', { item: 'home' }); setMobileMenuOpen(false); }} className="text-[#d3d3d3] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm">Home</a>
              <a href="#projects" onClick={() => { trackEvent('mobile_nav_click', { item: 'projects' }); setMobileMenuOpen(false); }} className="text-[#d3d3d3] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm">Projects</a>
              <a href="RESUME.pdf" target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('resume_click', { source: 'mobile_nav' }); setMobileMenuOpen(false); }} className="text-[#d3d3d3] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm">Resume</a>
              <a href="#contact" onClick={() => { trackEvent('mobile_nav_click', { item: 'contact' }); setMobileMenuOpen(false); }} className="text-[#d3d3d3] hover:text-[#f5c400] text-xs font-bold tracking-[1.5px] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] rounded-sm">Contact</a>
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

        <motion.div
          variants={SECTION_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <InfiniteMarquee />
        </motion.div>

        <motion.div
          variants={SECTION_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <SelectedWorks />
        </motion.div>
      </main>

      <ContactFooter />
    </div>
  );
};

export default App;
