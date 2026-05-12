"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BEVGridViz() {
  const [mAP, setMAP] = useState(0);

  useEffect(() => {
    let mapFrame: number;
    let mapStart: number;
    const animateMAP = (time: number) => {
      if (!mapStart) mapStart = time;
      const elapsed = time - mapStart;
      const p = Math.min(elapsed / 2000, 1);
      setMAP(42.4 * (1 - Math.pow(1 - p, 3)));
      if (p < 1) mapFrame = requestAnimationFrame(animateMAP);
    };
    mapFrame = requestAnimationFrame(animateMAP);

    return () => {
      cancelAnimationFrame(mapFrame);
    };
  }, []);

  const egoY = 75;

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[10px] text-[var(--ink-secondary)]">
        <span>LIFT-SPLAT-SHOOT · BEV FUSION</span>
        <span className="text-[var(--signal)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[var(--signal)] rounded-full animate-pulse-signal" />
          mAP: {mAP.toFixed(1)}
        </span>
      </div>

      {/* BEV Grid and Splines */}
      <div className="flex-grow relative border border-[var(--hairline)] bg-[var(--bg-void)] overflow-hidden">
        
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* Static Vertical Lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 10 - 20} y1="0" x2={i * 10 - 20} y2="100" stroke="var(--hairline-bold)" strokeWidth="0.2" />
          ))}

          {/* Moving Horizontal Grid Lines */}
          <motion.g 
             animate={{ y: [0, 10] }}
             transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          >
             {Array.from({ length: 15 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 10 - 20} x2="100" y2={i * 10 - 20} stroke="var(--hairline-bold)" strokeWidth="0.2" />
             ))}
          </motion.g>

          {/* Lane Splines */}
          <motion.path 
            fill="none" stroke="var(--signal)" strokeWidth="0.8" strokeDasharray="3 3"
            animate={{ 
              d: [
                `M 35 150 Q 50 50 30 -50`,
                `M 35 150 Q 20 50 40 -50`,
                `M 35 150 Q 50 50 30 -50`
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path 
            fill="none" stroke="var(--signal)" strokeWidth="0.8" strokeDasharray="3 3"
            animate={{ 
              d: [
                `M 65 150 Q 80 50 60 -50`,
                `M 65 150 Q 50 50 70 -50`,
                `M 65 150 Q 80 50 60 -50`
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Dynamic detected objects rendering behind ego vehicle */}
          <motion.g 
             animate={{ 
               y: [-50, 150], 
               x: [0, 8, 0] 
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
             <rect x="26" y="0" width="6" height="10" fill="rgba(255,138,61,0.15)" stroke="var(--warn)" strokeWidth="0.4" rx="1" />
             <text x="26" y="-3" fontSize="3" fill="var(--warn)" className="font-mono tracking-widest uppercase">VEH_A4</text>
          </motion.g>

          <motion.g 
             animate={{ 
               y: [-100, 120],
               x: [0, -5, 0]
             }}
             transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1.5 }}
          >
             <rect x="68" y="0" width="5" height="12" fill="rgba(198,255,61,0.1)" stroke="var(--signal)" strokeWidth="0.4" rx="1" />
             <text x="68" y="-3" fontSize="3" fill="var(--signal)" className="font-mono tracking-widest uppercase">VEH_B2</text>
          </motion.g>

          {/* Ego Vehicle */}
          <g transform={`translate(50, ${egoY})`}>
            {/* Perception frustum */}
            <motion.path 
              d="M 0 0 L -35 -70 A 50 50 0 0 1 35 -70 Z"
              fill="rgba(198,255,61,0.06)"
              stroke="var(--signal)"
              strokeWidth="0.2"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Ego body */}
            <rect x="-3" y="-6" width="6" height="12" fill="var(--bg-elevated)" stroke="var(--signal)" strokeWidth="0.5" rx="1" />
            {/* Tiny center dot */}
            <circle cx="0" cy="0" r="0.8" fill="var(--bg-void)" />
          </g>

        </svg>

      </div>

      <div className="flex gap-2 mt-3 items-center justify-between text-[8px] text-[var(--ink-tertiary)]">
        <span>CAMERAS: FRONT/REAR/SIDES</span>
        <span>FPS: 32</span>
      </div>
    </div>
  );
}
