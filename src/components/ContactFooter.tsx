import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail } from 'lucide-react';
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

// Brand icons (not available in lucide-react v1.7+)
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const LeetCodeIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

// Magnetic Button Wrapper
const MagneticButton = ({ children, href, eventName, ariaLabel, icon }: { children: React.ReactNode, href: string, eventName?: string, ariaLabel?: string, icon?: React.ReactNode }) => {
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
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'External profile link')}
      onClick={() => {
        if (eventName) {
          trackEvent(eventName, { href });
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="bg-[#151515]/88 backdrop-blur-md border border-[#333] text-[#aaa] text-[13px] font-bold py-[12px] px-[24px] rounded-full hover:text-white hover:border-[#f5c400] hover:shadow-[0_8px_22px_rgba(245,196,0,0.2)] transition-all duration-300 no-underline interactive z-10 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
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
          className="inline-flex items-center gap-3 max-w-[92vw] text-[#f5c400] text-[clamp(14px,4.2vw,32px)] font-bold no-underline border-2 border-[#f5c400] py-[12px] px-[20px] md:py-[20px] md:px-[60px] rounded-full transition-all duration-300 hover:bg-[#f5c400] hover:text-black hover:shadow-[0_14px_30px_rgba(245,196,0,0.28)] mb-[20px] interactive group relative overflow-hidden"
        >
          <Mail className="relative z-10 w-5 h-5 md:w-7 md:h-7 flex-shrink-0 group-hover:text-black transition-colors duration-300" />
          <span className="relative z-10 group-hover:text-black transition-colors duration-300 break-all">rsujithkumar201207@gmail.com</span>
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
          <MagneticButton href="https://github.com/Sujith-RMD" eventName="github_click" ariaLabel="GitHub Profile" icon={<GithubIcon size={18} />}>
            GitHub
          </MagneticButton>
          <MagneticButton href="https://www.linkedin.com/in/sujithkumar-r-267630378/" eventName="linkedin_click" ariaLabel="LinkedIn Profile" icon={<LinkedinIcon size={18} />}>
            LinkedIn
          </MagneticButton>
          <MagneticButton href="https://leetcode.com/u/SujithKumar-R/" eventName="leetcode_click" ariaLabel="LeetCode Profile" icon={<LeetCodeIcon size={18} />}>
            LeetCode (300+ Solved)
          </MagneticButton>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default ContactFooter;

