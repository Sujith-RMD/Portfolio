import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

type Project = {
  title: string;
  desc: string;
  outcome: string;
  tags: string[];
  accent: string;
  accentSoft: string;
  github: string;
  image: string;
  metrics: { label: string; value: string }[];
  caseStudy: string[];
  architecture: string[];
};

const PROJECTS: Project[] = [
  {
    title: 'CloudSeer',
    desc: 'Real-time AWS cost intelligence system that detects anomalies, forecasts spend, and auto-remediates idle resources before billing spikes.',
    outcome: '3rd Place @ MIT BLR TechSolstice',
    tags: ['FastAPI', 'AWS', 'ML'],
    accent: '#f5c400',
    accentSoft: 'rgba(245,196,0,0.12)',
    github: 'https://github.com/Sujith-RMD/CloudSeer',
    image: '/project-cloudseer.png',
    metrics: [
      { label: 'Anomaly Detection', value: 'Real-time' },
      { label: 'Resource Cleanup', value: 'Automated' },
      { label: 'Competition', value: '3rd Place' },
    ],
    caseStudy: [
      'Streaming cost telemetry ingestion and anomaly detection pipeline for AWS resources.',
      'Forecast layer predicts spend spikes and surfaces preventive recommendations before billing cycles close.',
      'Action workflow enables one-click remediation for idle infrastructure to reduce recurring waste.',
    ],
    architecture: [
      'Ingestion → AWS CloudWatch API → Real-time telemetry polling (60s)',
      'Processing → Statistical anomaly detection + ML forecast models',
      'Action → Automated idle-resource remediation via AWS SDK',
      'API → FastAPI endpoints serving dashboards and alert configuration',
    ],
  },
  {
    title: 'SecureFlow',
    desc: 'High-performance fraud detection API scoring UPI transactions in under 80ms using behavioral rules and pattern analysis.',
    outcome: 'Sub-80ms p95 latency under load',
    tags: ['FastAPI', 'React', 'TypeScript'],
    accent: '#00d4ff',
    accentSoft: 'rgba(0,212,255,0.12)',
    github: 'https://github.com/Sujith-RMD/SecureFlow',
    image: '/project-secureflow.png',
    metrics: [
      { label: 'P95 Latency', value: '<80ms' },
      { label: 'Decision Type', value: 'Explainable' },
      { label: 'Scoring', value: 'Real-time' },
    ],
    caseStudy: [
      'Low-latency API service for transaction risk scoring under strict response-time budgets.',
      'Rule + pattern engine combines behavior signals with explainable block/allow decisions.',
      'Built for real-time payment flows where precision and trust in outcomes are critical.',
    ],
    architecture: [
      'Input → UPI transaction payload via REST endpoint',
      'Engine → Multi-layer rule evaluation + behavioral pattern matching',
      'Decision → Explainable risk score with block/allow/review classification',
      'Dashboard → React + TypeScript frontend for transaction monitoring',
    ],
  },
  {
    title: 'RoadSense AI',
    desc: 'Multi-source AI system that detects infrastructure issues from public data streams using NLP, clustering, and real-time signal aggregation.',
    outcome: 'Multi-language NLP across 10+ languages',
    tags: ['AWS Bedrock', 'Multi-Agent', 'Python'],
    accent: '#10b981',
    accentSoft: 'rgba(16,185,129,0.12)',
    github: 'https://github.com/Sujith-RMD/RoadSense-AI',
    image: '/project-roadsense.png',
    metrics: [
      { label: 'Languages', value: '10+' },
      { label: 'Sources', value: 'Multi-stream' },
      { label: 'Clustering', value: 'Geo-spatial' },
    ],
    caseStudy: [
      'Data ingest from social/news sources to capture public infrastructure issue signals in near real-time.',
      'NLP processing normalizes multilingual text and clusters geographically related events.',
      'Confidence scoring layer prioritizes incidents for faster operational response.',
    ],
    architecture: [
      'Ingestion → Social media + news APIs → real-time data streams',
      'Translation → AWS Translate (10+ languages) → Bedrock multi-agent classification',
      'Clustering → Geo-spatial event grouping + confidence scoring',
      'Output → Priority-ranked infrastructure incident alerts',
    ],
  },
  {
    title: 'Pneumonia-AI',
    desc: 'Deep learning system for pneumonia detection using MobileNetV2 with Grad-CAM explainability, exposing prediction APIs via FastAPI.',
    outcome: '94.2% classification accuracy',
    tags: ['TensorFlow', 'FastAPI', 'Grad-CAM'],
    accent: '#8b5cf6',
    accentSoft: 'rgba(139,92,246,0.12)',
    github: 'https://github.com/Sujith-RMD/Pneumonia-AI',
    image: '/project-pneumonia.png',
    metrics: [
      { label: 'Accuracy', value: '94.2%' },
      { label: 'Model', value: 'MobileNetV2' },
      { label: 'Explainability', value: 'Grad-CAM' },
    ],
    caseStudy: [
      'Image inference stack built on MobileNetV2 for fast pneumonia classification support.',
      'Grad-CAM heatmaps provide interpretable visual regions behind model predictions.',
      'FastAPI endpoints package model serving for seamless integration into downstream systems.',
    ],
    architecture: [
      'Input → Chest X-ray image upload via FastAPI endpoint',
      'Model → MobileNetV2 transfer learning → pneumonia classification',
      'Explainability → Grad-CAM heatmap overlay generation',
      'API → Prediction + confidence score + heatmap response',
    ],
  },
];

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const githubIconPath =
  'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z';

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpenCaseStudy: (project: Project) => void;
};

const ProjectCard = ({ project, index, onOpenCaseStudy }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isReversed = index % 2 === 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="md:sticky rounded-2xl md:rounded-3xl border border-[#252525] shadow-[0_24px_60px_rgba(0,0,0,0.5)] interactive overflow-hidden group"
      style={{ top: `${100 + index * 40}px`, zIndex: index }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, delay: index * 0.06, ease: REVEAL_EASE }}
      onMouseMove={handleMouseMove}
    >
      {/* Accent glow on top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accent}50, transparent)` }}
      />

      {/* Mouse-follow spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{
          background: `radial-gradient(450px circle at ${mousePos.x}% ${mousePos.y}%, ${project.accentSoft}, transparent 60%)`,
        }}
      />

      {/* Card bg */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <div className={`relative z-10 flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} md:min-h-[420px]`}>
        {/* Image Side */}
        <div className="w-full md:w-[48%] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10 pointer-events-none" />
          {isReversed && (
            <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10 pointer-events-none" />
          )}

          <motion.img
            src={project.image}
            alt={`${project.title} dashboard preview`}
            width="800"
            height="500"
            loading="lazy"
            decoding="async"
            className="w-full h-[220px] md:h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />

          {/* Image overlay gradient from accent */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${project.accent}30, transparent 60%)`,
            }}
          />
        </div>

        {/* Content Side */}
        <div className={`w-full md:w-[52%] p-6 md:p-10 flex flex-col justify-center ${isReversed ? 'md:pr-10 md:pl-6' : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[clamp(26px,5vw,42px)] font-black tracking-[-1px] font-syne text-white">{project.title}</h3>
              <p
                className="text-[12px] font-bold uppercase tracking-[1.5px] mt-1"
                style={{ color: project.accent }}
              >
                {project.outcome}
              </p>
            </div>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} GitHub repository`}
              onClick={() => trackEvent('project_github_click', { project: project.title })}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#383838] bg-black/50 backdrop-blur-md text-[#888] hover:text-white transition-all duration-300 mt-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400]"
              style={{ '--hover-border': project.accent } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = project.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#383838')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={githubIconPath} />
              </svg>
            </a>
          </div>

          {/* Description */}
          <p className="text-[#a0a0a0] text-[14px] md:text-[16px] mb-5 leading-relaxed max-w-lg">{project.desc}</p>

          {/* Metrics Row */}
          <div className="flex flex-wrap gap-3 mb-5">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col items-center px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <span
                  className="text-[15px] md:text-[16px] font-black font-syne"
                  style={{ color: project.accent }}
                >
                  {metric.value}
                </span>
                <span className="text-[10px] text-[#666] uppercase tracking-[1px] mt-0.5">{metric.label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => {
                trackEvent('project_case_study_open', { project: project.title });
                onOpenCaseStudy(project);
              }}
              className="text-[12px] uppercase tracking-[1px] font-bold px-5 py-2.5 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: project.accent,
                borderColor: `${project.accent}40`,
                backgroundColor: `${project.accent}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${project.accent}22`;
                e.currentTarget.style.borderColor = project.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${project.accent}10`;
                e.currentTarget.style.borderColor = `${project.accent}40`;
              }}
            >
              View Deep Dive
            </button>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('project_source_click', { project: project.title })}
              className="text-[12px] uppercase tracking-[1px] text-[#777] hover:text-white transition-colors font-bold"
            >
              Source Code →
            </a>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/[0.04] backdrop-blur-md border border-[#333] text-[#bbb] text-[11px] font-bold py-[5px] px-[12px] rounded-full uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
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

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
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
            <ProjectCard key={project.title} project={project} index={idx} onOpenCaseStudy={setActiveProject} />
          ))}
        </div>
      </div>

      {/* Enhanced Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: REVEAL_EASE }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md pt-24 pb-6 px-4 md:px-10 overflow-y-auto"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ duration: 0.4, ease: REVEAL_EASE }}
              className="mx-auto max-w-4xl rounded-3xl border border-[#2a2a2a] bg-[#0a0a0a] shadow-2xl overflow-hidden relative"
              role="dialog"
              aria-modal="true"
              aria-label={`${activeProject.title} deep dive`}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal header image with close button */}
              <div className="relative h-[180px] md:h-[240px] overflow-hidden">
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} preview`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{ background: `linear-gradient(135deg, ${activeProject.accent}40, transparent 60%)` }}
                />
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 z-30 text-white/90 border border-white/30 bg-black/50 rounded-full px-5 py-2 text-[12px] uppercase tracking-[1px] font-bold hover:text-white hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c400] shadow-lg"
                >
                  Close ✕
                </button>
              </div>

              <div className="p-6 md:p-10">
                {/* Title & outcome */}
                <div className="mb-6">
                  <h3 className="text-[clamp(28px,4vw,44px)] font-syne font-black tracking-[-1px] text-white">{activeProject.title}</h3>
                  <p className="text-[13px] font-bold uppercase tracking-[1.5px] mt-1" style={{ color: activeProject.accent }}>
                    {activeProject.outcome}
                  </p>
                </div>

                <p className="text-[#b8b8b8] text-[15px] md:text-[16px] leading-relaxed mb-8">{activeProject.desc}</p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {activeProject.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex flex-col items-center px-5 py-3 rounded-xl border"
                      style={{
                        borderColor: `${activeProject.accent}25`,
                        backgroundColor: `${activeProject.accent}08`,
                      }}
                    >
                      <span className="text-[18px] font-black font-syne" style={{ color: activeProject.accent }}>
                        {metric.value}
                      </span>
                      <span className="text-[10px] text-[#777] uppercase tracking-[1px] mt-0.5">{metric.label}</span>
                    </div>
                  ))}
                </div>

                {/* Architecture */}
                <p
                  className="text-[11px] uppercase tracking-[1.6px] font-bold mb-4"
                  style={{ color: activeProject.accent }}
                >
                  System Architecture
                </p>

                <div className="mb-8 rounded-xl border border-[#222] bg-[#080808] p-5 font-mono text-[13px] leading-[2]">
                  {activeProject.architecture.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#444] select-none shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[#999]">
                        {line.split('→').map((part, j) => (
                          <span key={j}>
                            {j > 0 && <span style={{ color: activeProject.accent }}> → </span>}
                            {part}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Case study points */}
                <p
                  className="text-[11px] uppercase tracking-[1.6px] font-bold mb-3"
                  style={{ color: activeProject.accent }}
                >
                  Engineering Highlights
                </p>

                <div
                  className="space-y-3 mb-8 pl-4"
                  style={{ borderLeft: `2px solid ${activeProject.accent}30` }}
                >
                  {activeProject.caseStudy.map((point) => (
                    <p key={point} className="text-[#939393] text-[14px] leading-[1.75]">
                      {point}
                    </p>
                  ))}
                </div>

                {/* Tags and link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-[1px] px-3 py-1.5 rounded-full border font-bold"
                        style={{
                          color: activeProject.accent,
                          borderColor: `${activeProject.accent}30`,
                          backgroundColor: `${activeProject.accent}08`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('project_modal_github_click', { project: activeProject.title })}
                    className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[1px] rounded-full px-5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      color: activeProject.accent,
                      borderWidth: '1px',
                      borderColor: `${activeProject.accent}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = activeProject.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = activeProject.accent;
                      e.currentTarget.style.borderColor = `${activeProject.accent}40`;
                    }}
                  >
                    Open Repository
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SelectedWorks;
