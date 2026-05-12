"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useDragControls, useInView, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { timelineEvents, TimelineEvent } from '@/config/timeline';
import SectionIndex from '../ui/SectionIndex';
import MLPipelineServe from '../work/artifacts/MLPipelineServe';
import CVBoundingBox from '../work/artifacts/CVBoundingBox';

const timelineArtifacts: Record<string, React.ComponentType> = {
  'hcltech': MLPipelineServe,
  'matchday': CVBoundingBox,
};

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const [draggability, setDraggability] = useState({ left: 0, right: 0 });
  const [activeProject, setActiveProject] = useState<TimelineEvent | null>(null);
  const xOffset = useMotionValue(0);
  
  // Transform horizontal translation into a 5% -> 100% progress value
  const dragProgress = useTransform(xOffset, [0, draggability.left || -1000], ["5%", "100%"]);

  // Sort events chronologically logically 
  const sortedEvents = [...timelineEvents].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current && trackRef.current) {
        const cw = containerRef.current.offsetWidth;
        const tw = trackRef.current.scrollWidth;
        const maxDrag = Math.max(0, tw - cw + 200); // Allow scrolling to end + 200px padding
        setDraggability({ left: -maxDrag, right: 50 });
      }
    };
    
    // Slight delay to ensure content layout is complete before measuring
    setTimeout(updateBounds, 100);
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [sortedEvents]);

  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  // ESC key to close popup
  useEffect(() => {
    if (!activeProject) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeProject]);

  // Lock body scroll when popup open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  const handleCardClick = useCallback((ev: TimelineEvent, e: React.MouseEvent) => {
    if (ev.projectDetail) {
      e.stopPropagation();
      setActiveProject(ev);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const ease: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease } 
    }
  };

  return (
    <section id="timeline" className="relative w-full min-h-screen py-32 bg-[var(--bg-void)] overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => dragControls.start(e)}
    >
      <div className="grid-container mb-24 pointer-events-none relative z-10">
        <div className="col-span-12">
          <SectionIndex index="05" title="Trajectory" />
        </div>
      </div>

      <div ref={containerRef} className="w-full relative h-[60vh] flex items-center overflow-visible">
        {/* The horizontal hairline spine */}
        <motion.div 
          className="absolute left-0 top-1/2 -mt-px h-px bg-[var(--hairline-bold)] pointer-events-none z-0" 
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <motion.div
          ref={trackRef}
          drag="x"
          dragControls={dragControls}
          dragConstraints={draggability}
          dragElastic={0.1}
          style={{ x: xOffset, width: 'max-content' }}
          className="flex items-center absolute left-6 md:left-24 lg:left-48 h-full z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {sortedEvents.map((ev, idx) => {
            const isEdu = ev.type === 'edu';
            const isAchiev = ev.type === 'achievement';
            const isLatest = idx === sortedEvents.length - 1;
            const hasProject = !!ev.projectDetail;

            return (
              <motion.div key={`${ev.sortDate}-${idx}`} variants={itemVariants} className="relative flex flex-col items-center justify-center" style={{ minWidth: '320px', height: '100%' }}>
                
                {/* Dot */}
                <div className={`w-3 h-3 rounded-full absolute top-1/2 -mt-[6px] transition-colors duration-300 z-10 
                  ${isLatest ? 'bg-[var(--signal)] shadow-[0_0_10px_var(--signal)]' : isAchiev ? 'bg-[var(--warn)] shadow-[0_0_8px_var(--warn)] border-none' : 'bg-[var(--bg-void)] border border-[var(--ink-tertiary)] hover:border-[var(--ink-primary)]'}`} 
                />

                {/* Content Card */}
                <div 
                  className={`absolute p-6 w-[260px] md:w-[280px] bg-[var(--bg-elevated)] border-y border-r border-l-2 border-[var(--hairline)] transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] 
                  ${isEdu ? 'border-l-[var(--tag-ai)] hover:translate-y-2 top-[calc(50%+32px)]' : 
                    isAchiev ? 'border-l-[var(--warn)] hover:-translate-y-2 bottom-[calc(50%+32px)] shadow-[0_0_15px_-5px_rgba(255,138,61,0.2)]' : 
                    'border-l-[var(--signal)] hover:-translate-y-2 bottom-[calc(50%+32px)]'
                  } ${hasProject ? 'cursor-pointer hover:border-[var(--signal)]/60' : ''}`}
                  onClick={(e) => handleCardClick(ev, e)}
                >
                  
                  {/* Stem connector */}
                  <div className={`absolute w-px h-8 left-1/2 -ml-px ${!isEdu ? 'top-full bg-gradient-to-b from-[var(--hairline-bold)] to-transparent' : 'bottom-full bg-gradient-to-t from-[var(--hairline-bold)] to-transparent'}`} />
                  
                  <div className="flex justify-between items-start mb-4">
                     <div className={`mono ${isEdu ? 'text-[var(--tag-ai)]' : isAchiev ? 'text-[var(--warn)]' : 'text-[var(--signal)]'} opacity-80`}>{ev.date}</div>
                     <div className="mono text-[9px] font-bold text-[var(--ink-secondary)] opacity-60 border border-[var(--hairline-bold)] px-2 py-0.5 rounded-[2px] bg-[var(--bg-void)] uppercase">
                       {isAchiev ? '🏆 ACHIEVEMENT' : ev.type}
                     </div>
                  </div>
                  
                  <h4 className="heading text-[var(--ink-primary)] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{ev.title}</h4>
                  <p className="body text-[var(--ink-secondary)] mb-4">{ev.role}</p>
                  
                  {ev.highlight && (
                    <div className="border-t border-[var(--hairline)] pt-3 mb-4">
                      <p className="caption text-[var(--ink-primary)] italic opacity-90 leading-relaxed max-w-[240px]">
                        {ev.highlight}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <p className="mono font-bold text-[10px] text-[var(--ink-tertiary)] opacity-60 uppercase tracking-widest">{ev.location}</p>
                    {ev.link && (
                      <a href={ev.link} target="_blank" rel="noreferrer" className="mono text-[10px] text-[var(--ink-primary)] hover:text-[var(--warn)] transition-colors inline-flex items-center gap-1" data-magnetic>
                        Devpost ↗
                      </a>
                    )}
                    {hasProject && (
                      <span className="mono text-[9px] text-[var(--signal)] opacity-70 uppercase tracking-widest">
                        View Project ↗
                      </span>
                    )}
                  </div>
                </div>

              </motion.div>
            );
          })}

          {/* End cap "Now" */}
          <motion.div variants={itemVariants} className="relative flex items-center" style={{ minWidth: '300px', height: '100%' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-signal absolute top-1/2 -mt-px -ml-[3px] z-10 shadow-[0_0_8px_var(--signal)]" />
            <div className="absolute top-[calc(50%+24px)] left-0 mono text-[var(--signal)] whitespace-nowrap tracking-widest text-[10px]">
               NOW · LATER
            </div>
            {/* Visual fade-out stem line indicating future */}
            <div className="absolute left-[3px] top-1/2 -mt-[0.5px] h-px w-[150px] bg-gradient-to-r from-[var(--hairline-bold)] to-transparent z-0" />
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[240px] md:w-[320px] pointer-events-none flex flex-col items-center gap-3">
         <div className="mono tracking-widest text-[var(--ink-tertiary)] opacity-50 text-[9px] uppercase">
           Drag or Scroll Horizontally
         </div>
         <div className="w-full h-[2px] bg-[var(--hairline)] relative rounded-full overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-[var(--signal)]"
              style={{ width: dragProgress }} 
            />
         </div>
      </div>

      {/* Project Detail Popup */}
      <AnimatePresence>
        {activeProject?.projectDetail && (() => {
          const detail = activeProject.projectDetail!;
          const ArtifactComponent = timelineArtifacts[detail.artifactSlug];
          return (
            <motion.div
              className="fixed inset-0 z-[1000] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                onClick={() => setActiveProject(null)}
              />

              {/* Popup Card */}
              <motion.div
                className="relative z-[1001] w-[90vw] max-w-[640px] mx-4 border border-[var(--hairline-bold)] bg-[var(--bg-elevated)]/95 backdrop-blur-md overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Header */}
                <div className="border-b border-[var(--hairline)] px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse-signal" />
                    <span className="mono text-xs text-[var(--ink-secondary)] uppercase tracking-[0.15em]">
                      {activeProject.title} · {activeProject.date}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="mono text-[10px] text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors tracking-widest cursor-pointer uppercase"
                  >
                    ✕ Close · ESC
                  </button>
                </div>

                {/* Artifact */}
                {ArtifactComponent && (
                  <div className="h-[280px] md:h-[320px] bg-[var(--bg-void)] relative border-b border-[var(--hairline)]">
                    <div className="absolute inset-0 overflow-hidden">
                      <ArtifactComponent />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="heading text-[var(--ink-primary)] mb-1">{activeProject.title}</h3>
                  <p className="body text-[var(--ink-secondary)] mb-4">{detail.subtitle}</p>
                  
                  <p className="body text-[var(--ink-primary)] leading-relaxed italic border-l-2 border-[var(--signal)] pl-4 py-1 mb-6">
                    {detail.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    {detail.metrics.map(m => (
                      <span key={m} className="mono text-[10px] text-[var(--signal)] border border-[var(--signal)]/30 px-3 py-1 rounded bg-[var(--signal)]/[0.05] uppercase tracking-wider">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {detail.tags.map(tag => (
                      <span key={tag} className="border border-[var(--hairline-bold)] px-3 py-1 rounded bg-[var(--bg-void)] text-xs font-mono text-[var(--ink-secondary)] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}

