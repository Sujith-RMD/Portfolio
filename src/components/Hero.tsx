import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const COLUMN_STAGGER = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.78,
      ease: REVEAL_EASE,
      staggerChildren: 0.12,
      delayChildren: 0.45,
    },
  },
} as const;

const ITEM_REVEAL = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: REVEAL_EASE },
  },
} as const;

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] md:min-h-screen flex items-center relative pt-24 pb-14 md:py-0 px-[5%] overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute left-[8%] top-[22%] h-28 w-28 rounded-full bg-[#f5c400]/10 blur-3xl" />
        <div className="absolute right-[10%] top-[18%] h-24 w-24 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[20%] bottom-[18%] h-36 w-36 rounded-full bg-[#f5c400]/8 blur-3xl" />
      </motion.div>

      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
        <div className="relative h-[34vh] sm:h-[38vh] md:h-[70vh] max-h-[800px] flex items-center justify-center pointer-events-none perspective-[1000px]">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.25, ease: REVEAL_EASE }}
            className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] max-w-[700px] max-h-[700px] absolute z-0"
            style={{
              background: 'radial-gradient(circle, rgba(245,196,0,0.4) 0%, rgba(10,10,10,0) 70%)',
              filter: 'blur(40px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.15, ease: REVEAL_EASE }}
            className="absolute z-[5] h-[54%] w-[56%] rounded-[40%] border border-white/10 bg-white/[0.03] blur-[0.5px]"
          />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotateX: -mousePosition.y,
              rotateY: mousePosition.x,
            }}
            transition={{
              y: { duration: 1, delay: 0.2 },
              opacity: { duration: 1, delay: 0.2 },
              rotateX: { type: 'spring', stiffness: 100, damping: 30 },
              rotateY: { type: 'spring', stiffness: 100, damping: 30 },
            }}
            className="h-full w-auto relative z-10 flex justify-center perspective-[1000px] transform-style-[preserve-3d]"
          >
            <img
              src="/Whisk_ffff2a7bcb8b7c5b6614e7eff5344104eg.png"
              alt="Sujith Kumar R"
              width="820"
              height="980"
              decoding="async"
              fetchPriority="high"
              className="h-full w-auto object-cover opacity-95 md:opacity-100 drop-shadow-[0_0_50px_rgba(245,196,0,0.25)]"
            />

            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.09] via-transparent to-[#f5c400]/[0.08]"
            />
          </motion.div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-[35%] bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-[20] pointer-events-none" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] bg-[#050505] z-[20] pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-full z-20 pointer-events-none md:gap-0 gap-12 mt-4 md:mt-0">
        <motion.div
          variants={COLUMN_STAGGER}
          initial="hidden"
          animate="show"
          className="pointer-events-auto max-w-[92vw] md:max-w-[320px] text-center md:text-left mt-2 md:mt-0"
        >
          <motion.p
            variants={ITEM_REVEAL}
            className="relative mb-5 max-w-[520px] rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d]/78 md:bg-[#0d0d0d]/62 px-4 md:px-5 py-4 text-[14px] leading-[1.75] text-[#cfcfcf] backdrop-blur-md md:backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_12%_12%,rgba(245,196,0,0.14),transparent_45%)]" />
            <span className="relative block">
              Backend engineer building
              <span className="bg-gradient-to-r from-[#f5c400] to-[#ffe27a] bg-clip-text px-1 font-semibold text-transparent">
                production-ready backend systems
              </span>
            </span>
            <span className="relative mt-2 block text-[#b9b9b9]">
              I design high-performance APIs with FastAPI, work with SQL databases, and deploy scalable services on AWS.
            </span>
            <span className="relative mt-2 block text-[#888] text-[13px]">
              Built systems for fraud detection, AWS cost optimization, and AI-powered analysis.
            </span>
          </motion.p>

          <motion.div variants={ITEM_REVEAL} className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href="#projects"
              onClick={() => trackEvent('cta_view_projects_click', { section: 'hero' })}
              className="text-white text-[13px] font-bold no-underline border-b border-white pb-[2px] transition-all duration-200 hover:text-[#f5c400] hover:border-[#f5c400] inline-flex items-center gap-1 group interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
            >
              View Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('resume_click', { source: 'hero' })}
              className="text-[#f5c400] text-[13px] font-bold no-underline border-b border-[#f5c400] pb-[2px] transition-all duration-200 hover:text-white hover:border-white inline-flex items-center gap-1 group interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm"
            >
              View Resume
            </a>
          </motion.div>

          <motion.p variants={ITEM_REVEAL} className="text-[#909090] text-[12px] mt-4 max-w-[320px] mx-auto md:mx-0 rounded-xl bg-[#0d0d0d]/55 px-3 py-2 md:bg-transparent md:px-0 md:py-0">
            Built and deployed multiple real-world backend systems handling APIs, ML pipelines, and cloud workflows.
          </motion.p>
        </motion.div>

        <motion.div
          variants={COLUMN_STAGGER}
          initial="hidden"
          animate="show"
          className="pointer-events-auto text-center md:text-right flex flex-col items-center md:items-end font-syne"
        >
          <motion.div
            variants={ITEM_REVEAL}
            className="md:hidden relative h-[33vh] min-h-[220px] max-h-[320px] w-full mb-7 flex items-center justify-center pointer-events-none"
          >
            <div
              className="absolute z-0 h-[88vw] w-[88vw] max-h-[360px] max-w-[360px]"
              style={{
                background: 'radial-gradient(circle, rgba(245,196,0,0.35) 0%, rgba(10,10,10,0) 70%)',
                filter: 'blur(34px)',
              }}
            />
            <img
              src="/Whisk_ffff2a7bcb8b7c5b6614e7eff5344104eg.png"
              alt="Sujith Kumar R"
              width="600"
              height="760"
              decoding="async"
              fetchPriority="high"
              className="relative z-10 h-full w-auto object-cover opacity-95 drop-shadow-[0_0_40px_rgba(245,196,0,0.2)]"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180vw] h-[40%] bg-gradient-to-t from-[#050505] via-[#050505]/88 to-transparent z-[20]" />
          </motion.div>

          {['build.', 'ship.', 'repeat.'].map((word, index) => (
            <motion.div
              key={word}
              variants={ITEM_REVEAL}
              transition={{ duration: 0.78, ease: REVEAL_EASE, delay: index * 0.06 }}
              className="text-[clamp(40px,13vw,130px)] font-bold text-white leading-[0.85] tracking-[-2px] md:tracking-[-4px] uppercase"
            >
              {index === 2 ? <span className="text-transparent text-outline-yellow">{word}</span> : word}
            </motion.div>
          ))}

          <motion.div variants={ITEM_REVEAL} className="flex justify-center md:justify-end gap-2 mt-6 md:mt-8 flex-wrap">
            {['FastAPI', 'REST API', 'MySQL', 'AWS', 'Python'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 1.25 + i * 0.08, ease: REVEAL_EASE }}
                className="bg-[#1a1a1a]/50 backdrop-blur-md border border-[#333] text-[#aaa] hover:text-[#f5c400] hover:border-[#f5c400] transition-colors text-[11px] font-bold py-[6px] px-[14px] rounded-full tracking-[0.5px] cursor-none interactive"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
