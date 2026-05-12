"use client";

import { useRef, useState, useEffect } from 'react';
import { useAnimationFrame } from 'framer-motion';
import { metrics } from '@/config/metrics';
import SectionIndex from '../ui/SectionIndex';
import DigitFlicker from '../motion/DigitFlicker';
import Tooltip from '../ui/Tooltip';

export default function NumbersSection() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Duplicate metrics for infinite scroll (3 sets total)
  const duplicatedMetrics = [...metrics, ...metrics, ...metrics];

  useAnimationFrame((t, delta) => {
    if (!isMounted || !containerRef.current) return;
    
    if (!isHovered) {
      // Base speed
      x.current -= delta * 0.08;
    }

    const scrollWidth = containerRef.current.scrollWidth;
    if (scrollWidth === 0) return; // Wait for layout to compute

    const groupWidth = scrollWidth / 3;
    
    if (x.current <= -groupWidth) {
      x.current += groupWidth;
    }
    
    // Safety clamp to prevent breaking
    if (x.current > 0) x.current = 0;
    
    containerRef.current.style.transform = `translateX(${x.current}px)`;
  });

  return (
    <section id="numbers" className="w-full py-32 bg-[var(--bg-sunken)] border-t border-b border-[var(--hairline)] overflow-hidden">
      <div className="grid-container max-w-[1440px] mb-24">
        <div className="col-span-12">
          <SectionIndex index="06" title="Numbers" />
        </div>
      </div>

      <div 
        className="w-full relative py-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[var(--bg-sunken)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[var(--bg-sunken)] to-transparent z-10 pointer-events-none" />
        
        <div 
           ref={containerRef}
           className="flex gap-8 w-max px-8"
        >
          {duplicatedMetrics.map((metric, idx) => (
            <div
              key={`metric-${idx}-${metric.label}`} 
              className="flex flex-col w-[260px] md:w-[320px] shrink-0 border border-[var(--signal-dim)] bg-[var(--bg-void)] p-8 shadow-[0_0_15px_rgba(198,255,61,0.02)] hover:shadow-[0_0_25px_var(--signal-dim)] hover:border-[var(--signal)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <Tooltip content={metric.source}>
                <DigitFlicker 
                  value={metric.value} 
                  className="display-m text-[var(--signal)] mb-6 tracking-tight cursor-default group-hover:scale-105 origin-left transition-transform duration-500" 
                />
              </Tooltip>
              <div className="mono text-[var(--ink-secondary)] whitespace-pre-line opacity-80 leading-relaxed cursor-default mt-auto">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-container max-w-[1440px] mt-24">
         <div className="col-span-12 border-t border-[var(--hairline-bold)] pt-8">
          <p className="body text-[var(--ink-secondary)] italic opacity-80">
            * Every number above is from shipped code or peer-reviewed research. Hover over metrics for primary sources.
          </p>
        </div>
      </div>
    </section>
  );
}
