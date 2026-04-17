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
    <section id="capabilities" className="relative min-h-screen py-32 bg-[var(--bg-void)]">
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
              className={`col-span-12 md:col-span-6 xl:col-span-3 flex flex-col group transition-all duration-300 ease-out border-l border-[var(--hairline)] pl-6 py-4 xl:py-0 cursor-default ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
              style={{
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                borderLeftColor: isHovered ? role.tint : 'var(--hairline)'
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <ScrollReveal delay={idx * 0.1} className="flex flex-col h-full">
                <span className="mono text-[var(--ink-tertiary)] mb-8 tracking-widest">
                  /0{idx + 1}
                </span>
                
                <h3 className="display-m text-[var(--ink-primary)] mb-6 whitespace-pre-line leading-tight">
                  {role.label.replace(' ', '\n')}
                </h3>
                
                <p className="body text-[var(--ink-secondary)] mb-12 flex-grow max-w-[280px]">
                  {content.description}
                </p>

                <div className="flex flex-col gap-2 font-mono text-sm text-[var(--ink-secondary)] mb-16">
                  {content.stack.map(tech => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="mt-auto">
                  <span className="mono text-[var(--ink-tertiary)] block mb-4">SIGNATURE</span>
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
