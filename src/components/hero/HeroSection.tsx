"use client";

import React from 'react';
import SystemStatusPanel from './SystemStatusPanel';
import RoleChips from './RoleChips';
import HeroScene from './HeroScene';
import LineReveal from '../motion/LineReveal';
import SectionIndex from '../ui/SectionIndex';
import ScrollReveal from '../motion/ScrollReveal';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-end pb-[10vh] pt-[20vh] overflow-hidden">
      <HeroScene />
      
      <div className="grid-container w-full h-full relative z-10 w-full">
        {/* Left Column: Name & Intro */}
        <div className="col-span-12 xl:col-span-8 flex flex-col justify-end">
          <SectionIndex index="01" title="Index" className="mb-8" />
          
          <h1 className="display-xl mb-16">
            <LineReveal text="Preetham" delay={0} />
            <LineReveal text="Dandu." delay={0.1} />
          </h1>

          <div className="max-w-2xl mb-8">
            <LineReveal 
              text="Software Engineer building backend systems, AI agents, and ML infrastructure." 
              className="body-l text-[var(--ink-primary)] font-medium mb-4" 
              delay={0.2}
            />
            <ScrollReveal className="body text-[var(--ink-secondary)] leading-relaxed">
              M.S. Computer Science, Stony Brook (4.0 GPA) ·<br />
              Published thesis on safety-validated clinical AI ·<br />
              Shipping systems at 19,200 RPS.
            </ScrollReveal>
          </div>

          <ScrollReveal className="mt-4">
            <RoleChips />
          </ScrollReveal>
        </div>

        {/* Right Column: System Panel */}
        <div className="col-span-12 xl:col-span-4 flex flex-col justify-end xl:items-end mt-16 xl:mt-0">
          <ScrollReveal>
            <SystemStatusPanel />
          </ScrollReveal>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 mono text-[10px]">
        <span className="animate-bounce">↓</span>
        <span>SCROLL / 06 ACTS REMAINING</span>
      </div>
    </section>
  );
}
