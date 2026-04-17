"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { timelineEvents } from '@/config/timeline';
import SectionIndex from '../ui/SectionIndex';

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const [draggability, setDraggability] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current && trackRef.current) {
        const cw = containerRef.current.offsetWidth;
        const tw = trackRef.current.scrollWidth;
        // Allows dragging left up to tw - cw. 
        setDraggability({ left: -(tw - cw + 200), right: 50 });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return (
    <section id="timeline" className="relative w-full min-h-screen py-32 bg-[var(--bg-void)] overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => dragControls.start(e)}
    >
      <div className="grid-container mb-24 pointer-events-none relative z-10">
        <div className="col-span-12">
          <SectionIndex index="05" title="Trajectory" />
        </div>
      </div>

      <div ref={containerRef} className="w-full relative h-[60vh] flex items-center">
        {/* The horizontal hairline spine */}
        <div className="absolute left-0 right-0 top-1/2 -mt-px h-px bg-[var(--hairline-bold)] pointer-events-none z-0" />
        
        <motion.div
          ref={trackRef}
          drag="x"
          dragControls={dragControls}
          dragConstraints={draggability}
          dragElastic={0.1}
          className="flex items-center absolute left-12 md:left-24 lg:left-48 h-full z-10"
          style={{ width: 'max-content' }}
        >
          {timelineEvents.map((ev, idx) => {
            const isWork = ev.type === 'work';
            const isLatest = idx === timelineEvents.length - 1;

            return (
              <div key={idx} className="relative flex flex-col items-center justify-center min-w-[240px] md:min-w-[320px]">
                
                {/* Dot */}
                <div className={`w-3 h-3 rounded-full absolute top-1/2 -mt-[6px] transition-colors duration-300 z-10 
                  ${isLatest ? 'bg-[var(--signal)]' : 'bg-[var(--bg-void)] border border-[var(--ink-tertiary)]'}`} 
                />

                {/* Content Card */}
                <div className={`absolute p-6 w-[220px] md:w-[280px] bg-[var(--bg-elevated)] border border-[var(--hairline)] transition-transform hover:-translate-y-1 hover:border-[var(--signal)] ${isWork ? 'bottom-[calc(50%+24px)]' : 'top-[calc(50%+24px)]'}`}>
                  {/* Stem connector */}
                  <div className={`absolute w-px h-6 bg-[var(--hairline-bold)] left-1/2 -ml-px ${isWork ? 'top-full' : 'bottom-full'}`} />
                  
                  <div className="mono text-[var(--signal)] mb-4 opacity-80">{ev.date}</div>
                  <h4 className="heading text-[var(--ink-primary)] mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{titleCase(ev.title)}</h4>
                  <p className="body text-[var(--ink-secondary)] mb-4">{ev.role}</p>
                  <p className="mono text-[var(--ink-tertiary)] opacity-60">[{ev.location}]</p>
                </div>

              </div>
            );
          })}

          {/* End cap "Now" */}
          <div className="relative min-w-[300px] h-full flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-signal absolute top-1/2 -mt-px -ml-px z-10" />
            <div className="absolute top-[calc(50%+24px)] left-0 mono text-[var(--signal)]">NOW · LATER</div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 mono text-[var(--ink-tertiary)] opacity-50 flex items-center gap-2 pointer-events-none">
        ← DRAG HORIZONTALLY →
      </div>
    </section>
  );
}

function titleCase(str: string) {
  return str; // Keeping original formatting from timeline
}
