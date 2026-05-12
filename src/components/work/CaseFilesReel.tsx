"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';
import SectionIndex from '../ui/SectionIndex';
import { projects } from '@/config/projects';
import CaseCard from './CaseCard';

export default function CaseFilesReel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const xOffset = useMotionValue(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [vw, setVw] = useState(1440);

  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  // Measure viewport width
  useEffect(() => {
    const measure = () => setVw(window.innerWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const maxDrag = (projects.length - 1) * vw;

  // Progress bar
  const progressWidth = useTransform(xOffset, [0, -maxDrag || -1], ["2%", "100%"]);

  // Snap to card
  const goToCard = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, projects.length - 1));
    animate(xOffset, -(clamped * vw), {
      type: "spring",
      stiffness: 200,
      damping: 30,
    });
    setActiveIdx(clamped);
  }, [xOffset, vw]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;

      if (e.key === 'ArrowRight') { e.preventDefault(); goToCard(activeIdx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToCard(activeIdx - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIdx, goToCard]);

  const activeProject = projects[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[var(--bg-void)] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Selected Work — Case Files"
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-12 left-6 lg:left-12 z-20 pointer-events-none">
        <SectionIndex index="03" title="Selected Work — Case Files" />
      </div>

      {/* Full-viewport card track */}
      <motion.div
        ref={trackRef}
        className="flex h-screen"
        style={{ x: xOffset, width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="w-screen h-screen flex-shrink-0"
          >
            <CaseCard
              project={project}
              index={idx}
              total={projects.length}
            />
          </div>
        ))}
      </motion.div>

      {/* Bottom Nav Bar — fixed to bottom of section */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/90 to-transparent pt-16 pb-6 px-6 lg:px-12 pointer-events-none">
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col gap-3 pointer-events-auto">
          {/* Active project info */}
          <div className="flex justify-between items-baseline">
            <div className="flex items-baseline gap-3">
              <span className="mono text-[var(--signal)] tracking-widest text-xs">{activeProject.id}</span>
              <span className="mono text-[var(--ink-secondary)] text-xs hidden md:inline">·</span>
              <span className="body text-[var(--ink-primary)] text-sm hidden md:inline">{activeProject.title}</span>
            </div>
            <span className="mono text-[var(--ink-tertiary)] text-xs tracking-widest">
              {String(activeIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-[2px] bg-[var(--hairline)] relative rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-[var(--signal)]"
              style={{ width: progressWidth }}
            />
          </div>

          {/* Nav hint + arrows */}
          <div className="flex justify-between items-center">
            <span className="mono text-[9px] text-[var(--ink-tertiary)] opacity-50 uppercase tracking-widest">
              Arrow Keys · Click Arrows
            </span>
            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={() => goToCard(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="w-8 h-8 border border-[var(--hairline-bold)] flex items-center justify-center text-[var(--ink-secondary)] hover:border-[var(--signal)] hover:text-[var(--signal)] transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                onClick={() => goToCard(activeIdx + 1)}
                disabled={activeIdx === projects.length - 1}
                className="w-8 h-8 border border-[var(--hairline-bold)] flex items-center justify-center text-[var(--ink-secondary)] hover:border-[var(--signal)] hover:text-[var(--signal)] transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
