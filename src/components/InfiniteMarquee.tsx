
import { motion } from 'framer-motion';

const SKILLS = [
  "PYTHON", "FASTAPI", "REST APIs",
  "SQL", "MYSQL", "POSTGRESQL",
  "AWS (EC2, S3)",
  "API DESIGN", "BACKEND SYSTEMS",
  "GIT/GITHUB"
];

const InfiniteMarquee = () => {
  return (
    <section className="py-14 md:py-20 bg-[#f5c400] overflow-hidden whitespace-nowrap rotate-0 md:rotate-[-2deg] scale-100 md:scale-110 translate-y-0 md:translate-y-10 z-30 relative border-y border-black/15 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505]/25 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505]/25 to-transparent pointer-events-none" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/35" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/20" />
      </motion.div>
      <div className="flex w-[200%]">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
        >
          {/* First set */}
          {SKILLS.map((skill, index) => (
            <span 
              key={`skill-1-${index}`} 
              className="text-[#050505] text-[clamp(24px,8vw,80px)] font-black mx-5 md:mx-8 font-syne tracking-tight"
            >
              {skill} <span className="text-white mx-4">•</span>
            </span>
          ))}
          {/* Second set (duplicate for seamless loop) */}
          {SKILLS.map((skill, index) => (
            <span 
              key={`skill-2-${index}`} 
              className="text-[#050505] text-[clamp(24px,8vw,80px)] font-black mx-5 md:mx-8 font-syne tracking-tight"
            >
              {skill} <span className="text-white mx-4">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InfiniteMarquee;
