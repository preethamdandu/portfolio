"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SectionIndex from '../ui/SectionIndex';
import { projects } from '@/config/projects';
import CaseCard from './CaseCard';

export default function CaseFilesReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (!container || !wrapper) return;

      const sections = gsap.utils.toArray(wrapper.children);

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1, // Smooth scrub
          snap: 1 / (sections.length - 1), // Snap to each card
          end: () => `+=${container.offsetWidth * (sections.length - 1)}`,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="work" ref={containerRef} className="relative w-full overflow-hidden bg-[var(--bg-void)] min-h-screen">
      <div className="absolute top-12 left-6 lg:left-12 z-20">
        <SectionIndex index="03" title="Selected Work — Case Files" />
      </div>

      {/* 
        On mobile: standard vertical stack (flex-col).
        On desktop: flex-row with total width = items * 100vw, shifted via GSAP 
      */}
      <div 
        ref={wrapperRef} 
        className="flex flex-col lg:flex-row h-full"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, idx) => (
          <CaseCard key={project.id} project={project} index={idx} total={projects.length} />
        ))}
      </div>
    </section>
  );
}
