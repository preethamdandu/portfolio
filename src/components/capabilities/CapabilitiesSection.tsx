"use client";

import { useRef, useState } from 'react';
import { roles, Role } from '@/config/roles';
import { capabilities } from '@/config/capabilities';
import SectionIndex from '../ui/SectionIndex';
import LineReveal from '../motion/LineReveal';
import ScrollReveal from '../motion/ScrollReveal';

export default function CapabilitiesSection() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <section id="capabilities" className="relative min-h-screen pt-40 lg:pt-48 pb-32 bg-[var(--bg-void)]">
      <div className="grid-container mb-24">
        <div className="col-span-12 md:col-span-6">
          <SectionIndex index="02" title="Capabilities" />
        </div>
        <div className="col-span-12 md:col-span-6 flex justify-end">
          <SectionIndex index="" title="4 Disciplines" className="opacity-50" />
        </div>
      </div>

      <div className="grid-container">
        {roles.map((role, idx) => {
          const content = capabilities[role.id];
          const isHovered = hoveredRole === role.id;
          const isDimmed = hoveredRole !== null && !isHovered;

          return (
            <div 
              key={role.id}
              className={`col-span-12 md:col-span-6 xl:col-span-3 flex flex-col group transition-all duration-500 ease-out border-l border-[var(--hairline)] pl-6 py-6 xl:py-4 cursor-default rounded-r-lg ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
              style={{
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                borderLeftColor: isHovered ? role.tint : 'var(--hairline)',
                backgroundColor: isHovered ? 'rgba(255,255,255,0.015)' : 'transparent',
                boxShadow: isHovered ? `-1px 0 15px -5px ${role.tint}` : 'none'
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <ScrollReveal delay={idx * 0.1} className="flex flex-col h-full">
                <span 
                  className="mono mb-8 tracking-widest transition-colors duration-300"
                  style={{ color: isHovered ? role.tint : 'var(--ink-tertiary)' }}
                >
                  /0{idx + 1}
                </span>
                
                <h3 
                  className="display-m mb-6 whitespace-pre-line leading-tight transition-all duration-300"
                  style={{ 
                    color: isHovered ? role.tint : 'var(--ink-primary)',
                    textShadow: isHovered ? `0 0 20px ${role.tint}60` : 'none'
                  }}
                >
                  {role.label.replace(' ', '\n')}
                </h3>
                
                <p className="body text-[var(--ink-secondary)] mb-12 flex-grow max-w-[280px]">
                  {content.description}
                </p>

                <div className="flex flex-col gap-2 font-mono text-sm text-[var(--ink-secondary)] mb-16">
                  {content.stack.map(tech => (
                    <span key={tech} className={`transition-colors duration-300 ${isHovered ? 'text-[var(--ink-primary)]' : ''}`}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <span className={`mono block mb-4 transition-colors duration-300 ${isHovered ? 'text-[var(--ink-secondary)]' : 'text-[var(--ink-tertiary)]'}`}>
                    SIGNATURE
                  </span>
                  <div 
                    className="display-l mb-2 tabular-nums transition-colors duration-300"
                    style={{ color: isHovered ? role.tint : 'var(--signal)' }}
                  >
                    {role.metricValue}
                  </div>
                  <span className="mono-l text-[var(--ink-secondary)] opacity-80 whitespace-pre-line max-w-[200px] block leading-snug">
                    {role.metricLabel}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
