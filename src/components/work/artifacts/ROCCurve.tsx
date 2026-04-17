"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function ROCCurve() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      let raf: number;
      let start: number;
      const animate = (time: number) => {
        if (!start) start = time;
        const elapsed = time - start;
        const p = Math.min(elapsed / 1500, 1);
        // Easing out cubic
        const dp = 1 - Math.pow(1 - p, 3);
        setProgress(dp);
        if (p < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="w-full h-full p-8 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col items-center justify-center font-mono">
      <div className="relative w-64 h-48 border-l border-b border-[var(--hairline-bold)] mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible transform rotate-180 scale-x-[-1]">
          {/* Diagonal */}
          <line x1="0" y1="0" x2="100" y2="100" stroke="var(--hairline)" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {/* Baseline Model */}
          <path 
            d="M0,0 C10,50 40,75 100,100" 
            fill="none" 
            stroke="var(--ink-tertiary)" 
            strokeWidth="1" 
            strokeDasharray="150" 
            strokeDashoffset={150 * (1 - progress)} 
          />
          
          {/* Fused Model */}
          <path 
            d="M0,0 C15,70 30,90 100,100" 
            fill="none" 
            stroke="var(--signal)" 
            strokeWidth="2" 
            strokeDasharray="150" 
            strokeDashoffset={150 * (1 - progress)} 
            filter="drop-shadow(0 0 4px rgba(198,255,61,0.5))"
          />
        </svg>
        <div className="absolute top-2 left-4 text-[10px] text-[var(--signal)]">AUROC 0.892 (Fused)</div>
        <div className="absolute top-12 left-12 text-[10px] text-[var(--ink-tertiary)]">0.854 (Baseline)</div>
      </div>

      <div className="flex gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--ink-secondary)]">
        <span className="px-2 py-1 border border-[var(--hairline-bold)] bg-[var(--bg-elevated)] rounded-sm">INFRA</span>
        <span className="px-2 py-1 border border-[var(--hairline-bold)] bg-[var(--bg-elevated)] rounded-sm">MODEL</span>
        <span className="px-2 py-1 border border-[var(--signal)] bg-[var(--signal-glow)] text-[var(--signal)] rounded-sm">SAFETY</span>
      </div>
    </div>
  );
}
