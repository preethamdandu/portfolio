"use client";

import React, { useState } from 'react';
import SystemStatusPanel from './SystemStatusPanel';
import RoleChips from './RoleChips';
import HeroScene from './HeroScene';
import LineReveal from '../motion/LineReveal';
import SectionIndex from '../ui/SectionIndex';
import ScrollReveal from '../motion/ScrollReveal';
import DossierModal from './DossierModal';
import DossierDot from './DossierDot';

export default function HeroSection() {
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-end pb-[10vh] pt-[20vh] overflow-hidden">
      <HeroScene />
      
      <div className="grid-container w-full h-full relative z-10 w-full">
        {/* Left Column: Name & Intro */}
        <div className="col-span-12 xl:col-span-8 flex flex-col justify-end">
          <SectionIndex index="01" title="Index" className="mb-8" />
          
          <h1 className="display-xl mb-16">
            <LineReveal text="Preetham" delay={0} />
            <LineReveal text="Dandu" delay={0.1} suffix={<DossierDot onClick={() => setDossierOpen(true)} />} />
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

          <ScrollReveal className="mt-8 flex items-center gap-6" delay={0.3}>
            <a href="https://github.com/preethamdandu" target="_blank" rel="noreferrer" 
               className="text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors" 
               aria-label="GitHub" data-magnetic>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
              </svg>
            </a>
            <a href="https://linkedin.com/in/preetham-dandu" target="_blank" rel="noreferrer" 
               className="text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors" 
               aria-label="LinkedIn" data-magnetic>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="mailto:preethamdandu8@gmail.com" 
               className="text-[var(--ink-tertiary)] hover:text-[var(--signal)] transition-colors" 
               aria-label="Email" data-magnetic>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* Right Column: System Panel */}
        <div className="col-span-12 xl:col-span-4 flex flex-col justify-end xl:items-end mt-16 xl:mt-0">
          <ScrollReveal>
            <SystemStatusPanel onOpenDossier={() => setDossierOpen(true)} />
          </ScrollReveal>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 mono text-[10px]">
        <span className="animate-bounce">↓</span>
        <span>SCROLL / 06 ACTS REMAINING</span>
      </div>

      {/* Dossier Modal */}
      <DossierModal isOpen={dossierOpen} onClose={() => setDossierOpen(false)} />
    </section>
  );
}
