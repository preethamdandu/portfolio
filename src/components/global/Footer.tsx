"use client";

import { roles } from '@/config/roles';
import SectionIndex from '../ui/SectionIndex';
import CopyButton from '../ui/CopyButton';
import ScrollReveal from '../motion/ScrollReveal';

export default function Footer() {
  return (
    <section id="contact" className="relative w-full py-32 bg-[var(--bg-void)] min-h-screen flex flex-col justify-between">
      <div className="grid-container w-full">
        <div className="col-span-12 mb-24">
          <SectionIndex index="07" title="End of Document" />
        </div>

        <div className="col-span-12 xl:col-span-8 xl:col-start-3 text-center mb-24">
          <ScrollReveal>
            <h2 className="display-m text-[var(--ink-primary)] mb-6">
              Available for roles in <br className="hidden md:block"/>
              software, backend, ai, and ml.
            </h2>
            <p className="body-l text-[var(--ink-secondary)] italic">
              Shipping now — open to what's next.
            </p>
          </ScrollReveal>
        </div>

        {/* Middle divider */}
        <div className="col-span-12 xl:col-span-6 xl:col-start-4 mb-24 flex justify-center">
          <div className="w-full max-w-[300px] border-t border-[var(--hairline-bold)]"></div>
        </div>

        {/* Contact Links */}
        <div className="col-span-12 md:col-span-6 xl:col-span-4 xl:col-start-4 flex flex-col gap-4 mb-24 md:mb-0">
          <CopyButton text="preethamdandu8@gmail.com" label="preethamdandu8@gmail.com" />
          <CopyButton text="+1(934)221-6209" label="+1 (934) 221-6209" />
          <div className="h-8"></div>
          <a href="https://github.com/preethamdandu" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[var(--ink-primary)] hover:text-[var(--signal)] transition-colors mono" data-magnetic>
            github.com/preethamdandu ↗
          </a>
          <a href="https://linkedin.com/in/preetham-dandu" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[var(--ink-primary)] hover:text-[var(--signal)] transition-colors mono" data-magnetic>
            linkedin.com/in/preetham-dandu ↗
          </a>
        </div>

        {/* Resume Links */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex flex-col gap-4 text-[var(--ink-secondary)] mono">
          <a href="/resume/resume.pdf" download className="hover:text-[var(--ink-primary)] transition-colors flex items-center justify-between" data-magnetic>
            <span>/resume.pdf</span>
            <span className="opacity-50">— latest</span>
          </a>
          <div className="w-full border-t border-[var(--hairline)] my-2"></div>
          {roles.map(r => (
            <a key={r.id} href={`/resume/resume-${r.id}.pdf`} download className="hover:text-[var(--ink-primary)] transition-colors flex items-center justify-between group" data-magnetic>
              <span>/resume?role={r.id}</span>
              <span className="opacity-0 group-hover:opacity-50 transition-opacity">— {r.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid-container w-full mt-32 border-t border-[var(--hairline)] pt-8">
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-center mono text-[10px] text-[var(--ink-tertiary)] opacity-60">
          <span>© 2026 · Preetham Dandu</span>
          <span>Built in New York · v1.0.0 · commit a47f3e2</span>
        </div>
      </div>
    </section>
  );
}
