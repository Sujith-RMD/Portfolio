import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const FOOTER_STAGGER = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: REVEAL_EASE,
      staggerChildren: 0.14,
      delayChildren: 0.16,
    },
  },
} as const;

const FOOTER_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: REVEAL_EASE },
  },
} as const;

// Magnetic Button Wrapper
const MagneticButton = ({ children, href, eventName }: { children: React.ReactNode, href: string, eventName?: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={typeof children === 'string' ? children : 'External profile link'}
      onClick={() => {
        if (eventName) {
          trackEvent(eventName, { href });
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="bg-[#151515]/88 backdrop-blur-md border border-[#333] text-[#aaa] text-[13px] font-bold py-[12px] px-[24px] rounded-full hover:text-white hover:border-[#f5c400] hover:shadow-[0_8px_22px_rgba(245,196,0,0.2)] transition-all duration-300 no-underline interactive z-10 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
    >
      {children}
    </motion.a>
  );
};

const ContactFooter = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <footer 
      id="contact" 
      ref={containerRef}
      className="bg-[#050505] min-h-screen flex flex-col items-center justify-center py-14 md:py-20 px-[5%] text-center border-t border-[#111] relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-16 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(245,196,0,0.07),transparent_70%)] pointer-events-none" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1 }}
      >
        <div className="absolute left-[12%] top-[28%] h-36 w-36 rounded-full bg-[#f5c400]/10 blur-[90px]" />
        <div className="absolute right-[10%] bottom-[22%] h-44 w-44 rounded-full bg-white/7 blur-[100px]" />
      </motion.div>

      {/* Massive scaling text */}
      <motion.div 
        style={{ scale, opacity }}
        className="font-syne font-black text-[clamp(52px,15vw,250px)] leading-[0.8] tracking-[-0.05em] text-white mb-14 md:mb-32 flex flex-col"
      >
        <span>LET'S</span>
        <span className="text-transparent text-outline-yellow">BUILD.</span>
      </motion.div>

      <motion.div
        className="flex flex-col items-center relative z-10"
        variants={FOOTER_STAGGER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-120px' }}
      >
        <motion.a
          variants={FOOTER_ITEM}
          href="mailto:rsujithkumar201207@gmail.com" 
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('email_click', { location: 'footer' })}
          className="inline-block max-w-[92vw] text-[#f5c400] text-[clamp(14px,4.2vw,32px)] font-bold no-underline border-2 border-[#f5c400] py-[12px] px-[20px] md:py-[20px] md:px-[60px] rounded-full transition-all duration-300 hover:bg-[#f5c400] hover:text-black hover:shadow-[0_14px_30px_rgba(245,196,0,0.28)] mb-[20px] interactive group relative overflow-hidden break-all"
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-300">rsujithkumar201207@gmail.com</span>
          <div className="absolute inset-0 bg-[#f5c400] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </motion.a>
        <motion.span variants={FOOTER_ITEM} className="text-[#888] text-[16px] md:text-[24px] block mb-10 md:mb-[60px] font-medium">
          +91-8122032169
        </motion.span>

        <motion.p
          variants={FOOTER_ITEM}
          className="relative mb-8 max-w-[620px] rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f]/80 px-5 py-4 text-[13px] leading-relaxed tracking-[0.25px] text-[#b8b8b8] backdrop-blur-md"
        >
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_12%_10%,rgba(245,196,0,0.16),transparent_46%)]" />
          <span className="relative">
            Open to
            <span className="bg-gradient-to-r from-[#f5c400] to-[#ffe27a] bg-clip-text px-1 font-semibold text-transparent">backend internships</span>
            and high-impact project collaborations across API engineering, ML pipelines, and cloud systems.
          </span>
        </motion.p>
        
        <motion.div variants={FOOTER_ITEM} className="flex justify-center gap-4 md:gap-6 flex-wrap">
          <MagneticButton href="https://github.com/Sujith-RMD" eventName="github_click">
            GitHub
          </MagneticButton>
          <MagneticButton href="https://www.linkedin.com/in/sujithkumar-r-267630378/" eventName="linkedin_click">
            LinkedIn
          </MagneticButton>
          <MagneticButton href="https://leetcode.com/u/SujithKumar-R/" eventName="leetcode_click">
            LeetCode (300+ Solved)
          </MagneticButton>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default ContactFooter;
