
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

const INTRO_DURATION_MS = 2550;
const INTRO_PARTICLES = [
  { left: '8%', top: '16%', delay: 0.05, dur: 1.9 },
  { left: '16%', top: '72%', delay: 0.14, dur: 2.1 },
  { left: '22%', top: '34%', delay: 0.28, dur: 1.8 },
  { left: '31%', top: '12%', delay: 0.38, dur: 2.2 },
  { left: '38%', top: '67%', delay: 0.18, dur: 2.3 },
  { left: '49%', top: '24%', delay: 0.24, dur: 1.95 },
  { left: '57%', top: '78%', delay: 0.32, dur: 2.1 },
  { left: '64%', top: '41%', delay: 0.41, dur: 1.85 },
  { left: '71%', top: '20%', delay: 0.52, dur: 2.15 },
  { left: '78%', top: '62%', delay: 0.16, dur: 2.05 },
  { left: '84%', top: '30%', delay: 0.27, dur: 2.25 },
  { left: '91%', top: '74%', delay: 0.33, dur: 1.9 },
] as const;

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showIntro, setShowIntro] = useState(true);
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
    const id = window.requestAnimationFrame(() => {
      setAppReady(true);
    });

    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setShowIntro(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

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
    const sectionIds = ['hero', 'projects', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: '-20% 0px -30% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`font-['Inter'] text-white bg-[#050505] selection:bg-[#f5c400] selection:text-black transition-opacity duration-700 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[220] bg-[#040404] flex items-center justify-center overflow-hidden"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '72px 72px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.2, 0.14] }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              animate={{ backgroundPositionY: ['0%', '100%'] }}
              transition={{ duration: 3.2, ease: 'linear', repeat: Infinity }}
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '100% 6px',
                mixBlendMode: 'screen',
                opacity: 0.2,
              }}
            />

            {INTRO_PARTICLES.map((particle, index) => (
              <motion.span
                key={`intro-particle-${index}`}
                aria-hidden="true"
                className="absolute h-[3px] w-[3px] rounded-full bg-[#f5c400]"
                style={{ left: particle.left, top: particle.top, boxShadow: '0 0 16px rgba(245,196,0,0.8)' }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0.08, 0.82, 0.14], scale: [0.2, 1, 0.45], y: [0, -10, 0] }}
                transition={{ duration: particle.dur, delay: particle.delay, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
              />
            ))}

            <motion.div
              aria-hidden="true"
              className="absolute -left-[14vw] top-[12vh] h-[46vw] w-[46vw] rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.12, 0.24, 0.16], scale: [0.8, 1.14, 0.95], x: [0, 18, -8, 0], y: [0, 12, -6, 0] }}
              transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(245,196,0,0.35) 0%, rgba(245,196,0,0) 70%)',
                filter: 'blur(14px)',
              }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute -right-[16vw] bottom-[8vh] h-[40vw] w-[40vw] rounded-full"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={{ opacity: [0.08, 0.16, 0.1], scale: [0.84, 1.08, 0.92], x: [0, -16, 8, 0], y: [0, -10, 4, 0] }}
              transition={{ duration: 2.5, delay: 0.06, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 72%)',
                filter: 'blur(12px)',
              }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[56vmin] w-[56vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              animate={{ rotate: 360, scale: [0.94, 1.02, 0.94] }}
              transition={{ rotate: { duration: 5.4, ease: 'linear', repeat: Infinity }, scale: { duration: 2.6, repeat: Infinity, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="absolute inset-[12%] rounded-full border border-[#f5c400]/25" />
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute top-0 h-full w-[16vw] bg-gradient-to-r from-transparent via-[#f5c400]/35 to-transparent"
              initial={{ x: '-30vw', opacity: 0 }}
              animate={{ x: '130vw', opacity: [0, 0.75, 0] }}
              transition={{ duration: 1.35, delay: 0.22, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 0.9 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative z-10 px-6"
            >
              <motion.p
                initial={{ letterSpacing: '0.35em', opacity: 0 }}
                animate={{ letterSpacing: '0.18em', opacity: 1, y: [0, -2, 0] }}
                transition={{ letterSpacing: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.75 }, y: { duration: 2.1, repeat: Infinity, ease: [0.22, 1, 0.36, 1] } }}
                className="font-syne text-[12px] md:text-[13px] uppercase text-[#9b9b9b]"
              >
                Sujith Kumar R
              </motion.p>

              <h1 className="font-syne text-[clamp(38px,10vw,92px)] font-black tracking-[-2px] leading-[0.9] mt-2">
                {['build.', 'ship.', 'repeat.'].map((word, idx) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 18, filter: 'blur(8px)', rotateX: 28 }}
                    animate={{ opacity: 1, y: [0, -2, 0], filter: 'blur(0px)', rotateX: 0 }}
                    transition={{ duration: 0.65, delay: 0.18 + idx * 0.14, ease: [0.22, 1, 0.36, 1], y: { duration: 1.9, repeat: Infinity, ease: [0.22, 1, 0.36, 1], delay: 0.95 + idx * 0.12 } }}
                    className="inline-block mr-[0.18em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 text-[11px] md:text-[12px] uppercase tracking-[2px] text-[#7d7d7d]"
              >
                Crafting high-impact backend experiences
              </motion.p>

              <div className="mt-8 h-[2px] w-[min(320px,76vw)] rounded-full bg-white/10 overflow-hidden mx-auto">
                <motion.div
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.15, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full bg-gradient-to-r from-[#f5c400] via-[#ffe27a] to-[#f5c400]"
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.45] }}
                transition={{ duration: 1.2, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-[10px] uppercase tracking-[2px] text-[#8b8b8b]"
              >
                initializing portfolio engine
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
