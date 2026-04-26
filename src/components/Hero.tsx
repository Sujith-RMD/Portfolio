import { ArrowRight } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { trackEvent } from '../utils/analytics';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const ITEM_REVEAL = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: REVEAL_EASE },
  },
} as const;

const Hero = ({ introFinished = false }: { introFinished?: boolean }) => {
  const reduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  // Left column staggers in first, right column follows
  const leftColumnStagger = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.78,
        ease: REVEAL_EASE,
        staggerChildren: 0.14,
        delayChildren: 0.3,
      },
    },
  };

  const rightColumnStagger = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.78,
        ease: REVEAL_EASE,
        staggerChildren: 0.12,
        delayChildren: 0.55,
      },
    },
  };

  const spotlightX = useMotionValue(0.5);
  const spotlightY = useMotionValue(0.45);
  const smoothSpotlightX = useSpring(spotlightX, { stiffness: 95, damping: 22, mass: 0.45 });
  const smoothSpotlightY = useSpring(spotlightY, { stiffness: 95, damping: 22, mass: 0.45 });
  const spotlightBackground = useMotionTemplate`radial-gradient(520px circle at calc(${smoothSpotlightX} * 100%) calc(${smoothSpotlightY} * 100%), rgba(245,196,0,0.17), transparent 65%)`;

  const roles = ['Backend Engineer', 'API Architect', 'Cloud Builder'];

  useEffect(() => {
    if (reduceMotion) return;
    const roleTimer = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);

    return () => window.clearInterval(roleTimer);
  }, [reduceMotion, roles.length]);

  const handleHeroMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    spotlightX.set(x);
    spotlightY.set(y);
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] md:min-h-screen flex items-center relative pt-24 pb-14 md:py-0 px-[5%] overflow-hidden"
      onMouseMove={handleHeroMouseMove}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{ background: spotlightBackground }}
      />

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
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: [0.12, 0.22, 0.14], scale: [0.9, 1.03, 0.96], rotate: [-8, -2, -6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-[4] h-[58%] w-[70%] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(closest-side at 48% 46%, rgba(245,196,0,0.18) 0%, rgba(245,196,0,0.08) 36%, rgba(245,196,0,0) 72%)',
              filter: 'blur(22px)',
            }}
          />

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0.18, 0.34, 0.22], scale: [0.95, 1.02, 0.98] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-[5] h-[72%] w-[84%] rounded-full blur-[48px]"
            style={{
              background:
                'radial-gradient(circle at 52% 50%, rgba(245,196,0,0.24) 0%, rgba(245,196,0,0.1) 20%, rgba(245,196,0,0.03) 38%, rgba(245,196,0,0) 68%)',
            }}
          />

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.14, 0.08] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-[5] h-[60%] w-[72%] rounded-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 28%, rgba(245,196,0,0.08) 50%, rgba(255,255,255,0.02) 72%, rgba(255,255,255,0.1) 100%)',
              filter: 'blur(34px)',
              maskImage: 'radial-gradient(circle at center, black 52%, transparent 86%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 52%, transparent 86%)',
            }}
          />

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: [0.08, 0.16, 0.1], scale: [0.96, 1.02, 0.98] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-[6] h-[66%] w-[68%] rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 24%, rgba(255,255,255,0.0) 64%)',
              filter: 'blur(30px)',
            }}
          />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: reduceMotion ? 0 : [0, -6, 0],
              opacity: 1,
            }}
            transition={{
              y: { duration: 1, delay: 0.2 },
              opacity: { duration: 1, delay: 0.2 },
              ...(reduceMotion
                ? {}
                : {
                    y: {
                      delay: 0.2,
                      duration: 7,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    },
                  }),
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
          variants={leftColumnStagger}
          initial="hidden"
          animate={introFinished ? 'show' : 'hidden'}
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

          <motion.div
            variants={ITEM_REVEAL}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#373737] bg-[#0f0f0f]/75 px-4 py-2 text-[11px] uppercase tracking-[1.6px] text-[#9f9f9f]"
          >
            <span className="h-2 w-2 rounded-full bg-[#f5c400] shadow-[0_0_12px_rgba(245,196,0,0.8)]" />
            <span className="text-[#7d7d7d]">Now operating as</span>
            <span className="min-w-[148px] text-left text-[#f5c400] font-bold">
              {roles[roleIndex]}
            </span>
          </motion.div>

          <motion.div
            variants={ITEM_REVEAL}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/[0.06] px-4 py-1.5 text-[11px] uppercase tracking-[1.4px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
            <span className="text-[#10b981] font-bold">GSSoC'26 Open Source Contributor</span>
          </motion.div>

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
          variants={rightColumnStagger}
          initial="hidden"
          animate={introFinished ? 'show' : 'hidden'}
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
              {index === 2 ? <span className="hero-repeat-flicker" data-text={word}>{word}</span> : word}
            </motion.div>
          ))}

          <motion.div variants={ITEM_REVEAL} className="flex justify-center md:justify-end gap-2.5 mt-6 md:mt-8 flex-wrap">
            {[
              { tag: 'FastAPI', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0C5.375 0 0 5.375 0 12c0 6.627 5.375 12 12 12 6.626 0 12-5.373 12-12 0-6.625-5.373-12-12-12zm-.624 21.62v-7.528H7.19L13.203 2.38v7.528h4.029L11.376 21.62z"/></svg> },
              { tag: 'Python', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.403 3.35-3.403h5.766s3.24.052 3.24-3.134V3.202S18.28 0 11.914 0zM8.708 1.85a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12z"/><path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.122S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.403-3.35 3.403H9.45s-3.24-.052-3.24 3.134v5.323S5.72 24 12.086 24zm3.206-1.85a1.06 1.06 0 110-2.12 1.06 1.06 0 010 2.12z"/></svg> },
              { tag: 'MySQL', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a66.32 66.32 0 00-.454-5.772l-.04.019c-.16.882-.56 2.658-.963 5.754H2.46l-1.2-6.826h.66l.5 4.063c.04.32.073.64.107.96l.04-.02c.163-.96.457-2.593.923-5.003h.927c.147.96.453 2.58.86 4.87l.04-.02c.06-.48.2-1.52.46-4.87h.647zM8.982 16.97l-.22 1.723h-.66l.86-6.826h.86l.86 6.826h-.72l-.2-1.722zm.107-.88l-.3-2.643-.24.568c-.12.508-.24 1.258-.36 2.076zm3.494 2.603c-.56 0-.9-.32-1.04-.96-.06-.28-.1-.86-.1-1.762 0-.94.02-1.562.08-1.842.14-.68.46-1.022 1.02-1.022.54 0 .86.342 1 1.022.04.28.08.9.08 1.842 0 .922-.02 1.502-.08 1.762-.14.66-.46.96-.96.96zm.04-.66c.22 0 .34-.22.4-.66.04-.22.04-.82.04-1.762 0-.96-.02-1.542-.06-1.762-.06-.44-.2-.66-.4-.66-.22 0-.36.22-.4.66-.04.22-.06.8-.06 1.762 0 .94.02 1.542.06 1.762.04.44.18.66.42.66zM16.168 17.2c0 .66.02 1.122.06 1.382.04.3.14.4.28.4.22 0 .34-.22.4-.66l.66.06c-.1.82-.44 1.22-1.04 1.22-.44 0-.72-.24-.84-.72-.06-.22-.08-.82-.08-1.762 0-.94.02-1.562.08-1.842.14-.68.44-1.022.98-1.022.54 0 .86.32 1 .96.04.16.06.6.06 1.282h-1.56zm.04-1.182h.88c0-.54-.02-.9-.04-1.062-.04-.28-.14-.44-.34-.44-.22 0-.34.16-.4.44-.02.14-.04.52-.04 1.062h-.06zm4.843-2.142c-.26 0-.46.06-.62.18-.14.1-.28.28-.36.54l-.02-.7h-.62v6.826h.66v-2.503l.02.02c.2.28.44.42.74.42.34 0 .58-.18.72-.54.08-.2.12-.66.12-1.402v-.64c0-.82-.02-1.34-.08-1.582-.1-.44-.36-.64-.7-.64h.14zm-.04 3.862c-.04.3-.14.44-.34.44-.14 0-.26-.06-.36-.18v-3.404c.1-.16.22-.24.36-.24.2 0 .32.18.36.54.02.12.02.58.02 1.362 0 .84-.02 1.342-.04 1.482z"/><path d="M22.08 11.06c-.467-.08-.733-.14-.733-.14s.16-.41.22-.627c.06-.22.1-.44.14-.677 0 0 .467.14.667.22.2.08.48.2.66.28l.06-.26c-.2-.08-.466-.2-.733-.28-.2-.08-.466-.167-.666-.2.06-.3.1-.567.1-.867 0-.067 0-.134-.007-.2-.02-.267.007-.547-.073-.813-.02-.067-.1-.267-.18-.387-.293-.5-.56-.767-1-.86-.9-.2-1.667.28-2.4.707l-.027.014c-.28.18-.553.347-.833.52-.14.087-.354.2-.494.294l-.013-.007c-.08-.093-.167-.213-.247-.32a3.17 3.17 0 00-.8-.787c-.093-.06-.2-.14-.293-.193-.234-.14-.367-.1-.5.12a.93.93 0 00-.1.413c-.007.1.013.2.047.3.04.12.08.233.14.34.1.18.22.34.354.493.073.087.16.167.233.254a.4.4 0 01-.013.04c-.14.32-.26.66-.354 1.006-.006.027-.02.053-.02.08-.3-.12-.614-.207-.934-.234-.08-.006-.16-.02-.233-.02-.307-.006-.547.094-.667.4-.12.307-.06.6.14.867.1.127.227.227.367.307.18.107.373.187.56.254.16.053.327.1.494.14.06.013.12.033.18.04a7.72 7.72 0 00-.26.834l-.04.153c-.053-.02-.14-.033-.2-.047-.367-.087-.74-.147-1.114-.167-.12-.013-.24-.007-.36.02-.233.047-.38.194-.406.434a.65.65 0 00.166.506c.094.107.207.194.334.267.253.14.52.234.786.32.14.047.287.08.427.12-.04.18-.073.36-.1.54-.08.4-.14.813-.16 1.22-.008.12-.008.234.006.354.02.2.1.38.26.507.154.12.334.187.52.207.207.02.407.007.607-.047a2.8 2.8 0 00.806-.36c.127-.08.247-.174.36-.274.06-.054.12-.114.174-.174l.013.014a3.93 3.93 0 00.527.46c.353.24.74.407 1.166.474.3.047.567-.02.774-.254.18-.207.26-.46.28-.72.013-.24-.034-.46-.127-.68l-.007-.02c.2-.2.367-.42.52-.66a5.09 5.09 0 00.54-1.147c.007-.02.02-.033.027-.053.34.14.654.26 1 .294.14.014.28.014.42-.007.26-.047.427-.213.46-.48.04-.254-.04-.48-.22-.66a1.93 1.93 0 00-.433-.327 4.4 4.4 0 00-.534-.24c-.093-.034-.2-.06-.293-.094.067-.253.127-.513.167-.773z"/></svg> },
              { tag: 'AWS', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.032-.863.104-.296.072-.583.16-.863.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.024c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.152c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.128 0 .2.064.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.272-.15.328-.064.056-.176.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.216-.151-.248-.223a.504.504 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.176 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.248.328.375.703.375 1.118 0 .344-.072.655-.207.926-.144.272-.336.512-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.97-9.722 2.97-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.606z"/><path d="M22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.216.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg> },
              { tag: 'REST API', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
            ].map(({ tag, icon }, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.09, ease: REVEAL_EASE }}
                className="relative group bg-[#111]/70 backdrop-blur-xl border border-[#2a2a2a] text-[#bbb] text-[11px] font-bold py-[7px] px-[16px] rounded-full tracking-[0.5px] cursor-none interactive shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:text-[#f5c400] hover:border-[#f5c400]/60 hover:shadow-[0_8px_32px_rgba(245,196,0,0.2),inset_0_1px_0_rgba(245,196,0,0.1)] transition-[color,border-color,box-shadow] duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,196,0,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="relative flex items-center gap-1.5">
                  {icon}
                  {tag}
                </span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
