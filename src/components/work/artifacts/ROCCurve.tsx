"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ROCCurve() {
  const [points, setPoints] = useState<{fpr: number, tpr: number}[]>([]);
  const [baselinePoints, setBaselinePoints] = useState<{fpr: number, tpr: number}[]>([]);
  const [auc, setAuc] = useState(0);

  useEffect(() => {
    let t = 0;
    let isPaused = false;
    
    // Function to generate ROC curve points (parametric)
    const generatePoint = (t: number, strength: number) => {
      const fpr = t;
      const tpr = Math.pow(t, 1/strength);
      return { fpr, tpr };
    };

    const plotInterval = setInterval(() => {
      if (isPaused) return;

      if (t >= 1) {
        isPaused = true;
        setTimeout(() => {
          t = 0;
          setBaselinePoints([]);
          setAuc(0);
          setPoints([]);
          isPaused = false;
        }, 3000);
        return;
      }

      setPoints(prev => {
        const pt = generatePoint(t, 2.8 + (Math.random() * 0.05)); // Slight noise for fused
        const bpt = generatePoint(t, 1.5);
        t += 0.03;

        setBaselinePoints(b => [...b, bpt]);
        setAuc(prevAuc => prevAuc + (pt.tpr * 0.03)); 

        return [...prev, pt];
      });
    }, 60);

    return () => clearInterval(plotInterval);
  }, []);

  const createPath = (data: {fpr: number, tpr: number}[]) => {
    if (data.length === 0) return "";
    return `M 0 100 ` + data.map(p => `L ${p.fpr * 100} ${100 - p.tpr * 100}`).join(" ");
  };

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col font-mono text-[var(--ink-secondary)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-[10px] pb-4 border-b border-[var(--hairline)]">
         <span>FINGUARD · ML EVALUATION LOOP</span>
         <span className="text-[var(--signal)]">AUROC: {auc.toFixed(3)}</span>
      </div>

      <div className="flex-grow flex items-center justify-center relative px-8 py-4">
        <div className="relative w-full aspect-square max-h-full max-w-[240px]">
          {/* Axis Labels */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[7px] text-[var(--ink-tertiary)] tracking-widest uppercase origin-center whitespace-nowrap">True Positive Rate</div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] text-[var(--ink-tertiary)] tracking-widest uppercase whitespace-nowrap">False Positive Rate</div>

          {/* Chart Area */}
          <div className="w-full h-full border-l border-b border-[var(--hairline-bold)] relative bg-[var(--bg-void)]">
            
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {Array.from({length: 4}).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-[1px] bg-white" style={{ top: `${(i+1)*25}%` }} />
              ))}
              {Array.from({length: 4}).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-[1px] bg-white" style={{ left: `${(i+1)*25}%` }} />
              ))}
            </div>

            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Diagonal (Random Guess) */}
              <line x1="0" y1="100" x2="100" y2="0" stroke="var(--ink-tertiary)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
              
              {/* Baseline Path */}
              <path 
                d={createPath(baselinePoints)} 
                fill="none" 
                stroke="var(--ink-tertiary)" 
                strokeWidth="1" 
                opacity="0.6"
              />
              
              {/* Fused Model Path */}
              <path 
                d={createPath(points)} 
                fill="none" 
                stroke="var(--signal)" 
                strokeWidth="1.5" 
                filter="drop-shadow(0 0 4px rgba(198,255,61,0.4))"
              />

              {/* Leading Dot */}
              {points.length > 0 && (
                <motion.circle 
                  cx={points[points.length-1].fpr * 100} 
                  cy={100 - points[points.length-1].tpr * 100} 
                  r="2" 
                  fill="var(--signal)"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex justify-between text-[8px] text-[var(--ink-tertiary)] mt-6 pt-3 border-t border-[var(--hairline)]">
         <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--signal)] rounded-full"/> FUSED PIPELINE</div>
         <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--ink-tertiary)] rounded-full"/> BASELINE LSTM</div>
      </div>
    </div>
  );
}
