import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

type Project = {
  title: string;
  desc: string;
  outcome: string;
  tags: string[];
  color: string;
  github: string;
  caseStudy: string[];
};

const PROJECTS: Project[] = [
  {
    title: 'CloudSeer',
    desc: 'Real-time AWS cost intelligence system that detects anomalies, forecasts spend, and auto-remediates idle resources before billing spikes. Built with FastAPI, ML models, and AWS integrations. 3rd Place @ TechSolstice 2026.',
    outcome: 'Outcome: proactive anomaly alerts and automated idle-resource cleanup before monthly bill shock.',
    tags: ['FastAPI', 'AWS', 'ML'],
    color: '#1a1a1a',
    github: 'https://github.com/Sujith-RMD/CloudSeer',
    caseStudy: [
      'Streaming cost telemetry ingestion and anomaly detection pipeline for AWS resources.',
      'Forecast layer predicts spend spikes and surfaces preventive recommendations before billing cycles close.',
      'Action workflow enables one-click remediation for idle infrastructure to reduce recurring waste.',
    ],
  },
  {
    title: 'SecureFlow',
    desc: 'High-performance fraud detection API scoring UPI transactions in under 80ms using behavioral rules and pattern analysis. Designed for real-time decision systems with explainable outputs.',
    outcome: 'Outcome: sub-80ms scoring pipeline with transparent decision reasoning for safer transaction approvals.',
    tags: ['FastAPI', 'React', 'TypeScript'],
    color: '#222222',
    github: 'https://github.com/Sujith-RMD/SecureFlow',
    caseStudy: [
      'Low-latency API service for transaction risk scoring under strict response-time budgets.',
      'Rule + pattern engine combines behavior signals with explainable block/allow decisions.',
      'Built for real-time payment flows where precision and trust in outcomes are critical.',
    ],
  },
  {
    title: 'RoadSense AI',
    desc: 'Multi-source AI system that detects infrastructure issues from public data streams using NLP, clustering, and real-time signal aggregation across languages.',
    outcome: 'Outcome: faster infrastructure incident discovery by converting noisy public chatter into actionable geo-clustered signals.',
    tags: ['AWS Bedrock', 'Multi-Agent', 'Python'],
    color: '#151515',
    github: 'https://github.com/Sujith-RMD/RoadSense-AI',
    caseStudy: [
      'Data ingest from social/news sources to capture public infrastructure issue signals in near real-time.',
      'NLP processing normalizes multilingual text and clusters geographically related events.',
      'Confidence scoring layer prioritizes incidents for faster operational response.',
    ],
  },
  {
    title: 'Pneumonia-AI',
    desc: 'Deep learning system for pneumonia detection using MobileNetV2 with Grad-CAM explainability, exposing prediction APIs via FastAPI.',
    outcome: 'Outcome: model-backed diagnosis support with visual explainability and API-first integration for clinical workflows.',
    tags: ['TensorFlow', 'FastAPI', 'Grad-CAM'],
    color: '#1e1e1e',
    github: 'https://github.com/Sujith-RMD/Pneumonia-AI',
    caseStudy: [
      'Image inference stack built on MobileNetV2 for fast pneumonia classification support.',
      'Grad-CAM heatmaps provide interpretable visual regions behind model predictions.',
      'FastAPI endpoints package model serving for seamless integration into downstream systems.',
    ],
  },
];

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const CARD_STAGGER = {
  hidden: { opacity: 0, y: 56 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      delay: index * 0.08,
      ease: REVEAL_EASE,
    },
  }),
} as const;

type MagneticCardProps = {
  project: Project;
  index: number;
  onOpenCaseStudy: (project: Project) => void;
};

const MagneticCard = ({ project, index, onOpenCaseStudy }: MagneticCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.1;
    const y = (e.clientY - top - height / 2) * 0.1;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const githubIconPath =
    'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z';

  return (
    <motion.div
      className="md:sticky flex flex-col justify-center rounded-2xl md:rounded-3xl p-6 md:p-16 h-auto md:h-[500px] border border-[#333] shadow-[0_24px_60px_rgba(0,0,0,0.45)] interactive overflow-hidden group"
      style={{ top: `${100 + index * 40}px`, backgroundColor: project.color, zIndex: index }}
      custom={index}
      variants={CARD_STAGGER}
      initial="hidden"
      whileInView="show"
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, ease: REVEAL_EASE }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${position.x * 10 + 50}% ${position.y * 10 + 50}%, rgba(245,196,0,0.1) 0%, transparent 50%)`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/15 opacity-70 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[clamp(28px,7vw,48px)] font-black tracking-[-1px] font-syne">{project.title}</h3>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} GitHub repository`}
            onClick={() => trackEvent('project_github_click', { project: project.title })}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-[#444] bg-black/40 backdrop-blur-md text-[#aaa] hover:text-white hover:border-[#f5c400] hover:bg-black/70 transition-all duration-300 mt-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={githubIconPath} />
            </svg>
          </a>
        </div>

        <p className="text-[#a0a0a0] text-[15px] md:text-[18px] mb-5 md:mb-6 max-w-2xl leading-relaxed">{project.desc}</p>

        <p className="text-[#7f7f7f] text-[12px] md:text-[14px] mb-5 md:mb-6 max-w-2xl leading-relaxed tracking-[0.2px]">{project.outcome}</p>

        <div className="flex items-center gap-4 mb-5 md:mb-6">
          <button
            type="button"
            onClick={() => {
              trackEvent('project_case_study_open', { project: project.title });
              onOpenCaseStudy(project);
            }}
            className="text-[12px] uppercase tracking-[1px] text-[#f5c400] border border-[#5a4b12] bg-[#121212] px-4 py-2 rounded-full hover:border-[#f5c400] hover:text-[#fff2b0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400]"
          >
            View Case Study
          </button>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 md:gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-black/50 backdrop-blur-md border border-[#444] text-[#ccc] text-[11px] md:text-[12px] font-bold py-[6px] md:py-[8px] px-[12px] md:px-[16px] rounded-full uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SelectedWorks = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!activeProject) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [activeProject]);

  return (
    <section id="projects" className="py-20 md:py-32 px-[5%] bg-[#050505] relative z-20">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-20 h-36 bg-[radial-gradient(circle_at_50%_0%,rgba(245,196,0,0.08),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 1 }}
      >
        <div className="absolute left-[4%] top-[24%] h-36 w-36 rounded-full bg-[#f5c400]/8 blur-[85px]" />
        <div className="absolute right-[8%] bottom-[14%] h-44 w-44 rounded-full bg-white/6 blur-[95px]" />
      </motion.div>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: REVEAL_EASE }}
          className="text-[clamp(42px,10vw,90px)] font-black tracking-[-2px] mb-16 md:mb-24 text-white font-syne leading-none"
        >
          Selected <span className="text-transparent text-outline-yellow block md:inline">Works.</span>
        </motion.h2>

        <div className="flex flex-col gap-6 md:gap-8 pb-20 md:pb-32 relative z-10">
          {PROJECTS.map((project, idx) => (
            <MagneticCard key={project.title} project={project} index={idx} onOpenCaseStudy={setActiveProject} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: REVEAL_EASE }}
            className="fixed inset-0 z-[140] bg-black/70 backdrop-blur-sm px-5 py-10 md:px-10"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.4, ease: REVEAL_EASE }}
              className="mx-auto mt-2 md:mt-8 max-w-3xl max-h-[86vh] overflow-y-auto rounded-3xl border border-[#2f2f2f] bg-[#0d0d0d] p-6 md:p-10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={`${activeProject.title} case study`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <h3 className="text-[clamp(28px,4vw,44px)] font-syne font-black tracking-[-1px] text-white">{activeProject.title}</h3>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="text-[#aaa] border border-[#3b3b3b] rounded-full px-4 py-2 text-[12px] uppercase tracking-[1px] hover:text-white hover:border-[#f5c400] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400]"
                >
                  Close
                </button>
              </div>

              <p className="text-[#b8b8b8] text-[15px] md:text-[16px] leading-relaxed mb-7">{activeProject.desc}</p>

              <p className="text-[11px] uppercase tracking-[1.6px] text-[#f5c400] mb-3">Architecture Highlights</p>

              <div className="space-y-3 mb-8 border-l border-[#3a3a3a] pl-4">
                {activeProject.caseStudy.map((point) => (
                  <p key={point} className="text-[#939393] text-[14px] leading-[1.75]">
                    {point}
                  </p>
                ))}
              </div>

              <a
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('project_modal_github_click', { project: activeProject.title })}
                className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[1px] text-[#f5c400] border border-[#5b4b14] rounded-full px-5 py-2 hover:text-white hover:border-[#f5c400] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400]"
              >
                Open Repository
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SelectedWorks;
