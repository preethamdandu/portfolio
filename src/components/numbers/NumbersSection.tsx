"use client";

import { metrics } from '@/config/metrics';
import SectionIndex from '../ui/SectionIndex';
import DigitFlicker from '../motion/DigitFlicker';
import Tooltip from '../ui/Tooltip';
import ScrollReveal from '../motion/ScrollReveal';

export default function NumbersSection() {
  return (
    <section id="numbers" className="w-full py-32 bg-[var(--bg-sunken)] border-t border-b border-[var(--hairline)]">
      <div className="grid-container max-w-[1440px]">
        <div className="col-span-12 mb-24">
          <SectionIndex index="06" title="Numbers" />
        </div>

        {/* We have 8 metrics. We can split them into two rows of 4 or flow normally. */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-y-24 gap-x-8">
          {metrics.map((metric, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1} className="flex flex-col">
              <Tooltip content={metric.source}>
                {/* Ensure tabular nums are used for the flicker digit */}
                <DigitFlicker value={metric.value} className="display-m text-[var(--signal)] mb-6 tracking-tight cursor-default" />
              </Tooltip>
              <div className="mono text-[var(--ink-secondary)] whitespace-pre-line opacity-80 leading-relaxed cursor-default">
                {metric.label}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="col-span-12 mt-32 border-t border-[var(--hairline-bold)] pt-8">
          <p className="body text-[var(--ink-secondary)] italic">
            * Every number above is from shipped code or peer-reviewed research. Sources on hover.
          </p>
        </div>
      </div>
    </section>
  );
}
