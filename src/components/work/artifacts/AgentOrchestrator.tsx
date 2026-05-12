"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const USERS = ['U-01', 'U-02', 'U-03', 'U-04', 'U-05', 'U-06'];
const SONGS_COUNT = 12;

const fakeSongNames = [
  'Blinding', 'Rhapsody', 'Shape', 'Levitate', 
  'Starboy', 'Heat', 'Water', 'Drivers',
  'Stay', 'Peaches', 'Save', 'Industry'
];

interface Cell {
  u: number;
  s: number;
  affinity: number;
  glow: boolean;
}

export default function AgentOrchestrator() {
  const [matrix, setMatrix] = useState<Cell[]>([]);
  const [scanRow, setScanRow] = useState(0);
  const [activeRecs, setActiveRecs] = useState<string[]>([]);
  const [feedbackPulse, setFeedbackPulse] = useState(false);

  useEffect(() => {
    // Init matrix
    const initial: Cell[] = [];
    for (let u = 0; u < USERS.length; u++) {
      for (let s = 0; s < SONGS_COUNT; s++) {
        initial.push({ u, s, affinity: Math.random() * 0.8, glow: false });
      }
    }
    setMatrix(initial);

    // Rasterize scan line
    const scanInterval = setInterval(() => {
      setScanRow(prev => {
        const nextRow = (prev + 1) % USERS.length;
        
        // When we hit a new row, calculate top affinities
        setMatrix(current => {
          const rowData = current.filter(c => c.u === nextRow);
          const sorted = [...rowData].sort((a, b) => b.affinity - a.affinity);
          const top3Indices = sorted.slice(0, 3).map(c => c.s);
          
          setActiveRecs(top3Indices.map(s => fakeSongNames[s]));

          return current.map(c => ({
            ...c,
            glow: c.u === nextRow && top3Indices.includes(c.s)
          }));
        });

        return nextRow;
      });
    }, 1200);

    // RLHF Feedback shifts
    const rlhfInterval = setInterval(() => {
      setFeedbackPulse(true);
      setTimeout(() => setFeedbackPulse(false), 300);

      setMatrix(current => current.map(c => ({
        ...c,
        affinity: Math.max(0, Math.min(1, c.affinity + (Math.random() - 0.45) * 0.3)) // slight upward bias
      })));
    }, 4500);

    return () => {
      clearInterval(scanInterval);
      clearInterval(rlhfInterval);
    };
  }, []);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[10px] text-[var(--ink-secondary)] relative z-10 w-full">
        <span>TUNIEGENIE · COLLAB FILTERING</span>
        <span className={feedbackPulse ? 'text-[var(--warn)]' : 'text-[var(--signal)]'}>
          {feedbackPulse ? 'RLHF TENSOR UPDATE...' : 'INFERENCE'}
        </span>
      </div>

      <div className="flex-grow flex gap-4 h-full overflow-hidden relative">
        
        {/* Heatmap Grid */}
        <div className="flex-grow flex flex-col relative border border-[var(--hairline)] bg-[var(--bg-void)]">
          {/* Scanning line */}
          <motion.div 
            className="absolute left-0 w-full h-[1px] bg-[var(--signal)] shadow-[0_0_8px_var(--signal)] z-20 pointer-events-none"
            animate={{ top: `${(scanRow / USERS.length) * 100 + (100 / USERS.length / 2)}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />

          {USERS.map((user, r) => (
            <div key={user} className="flex-1 flex w-full relative group">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[6px] text-[var(--ink-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                {user}
              </div>
              
              {Array.from({ length: SONGS_COUNT }).map((_, c) => {
                const cell = matrix.find(x => x.u === r && x.s === c);
                const aff = cell?.affinity || 0;
                const isGlow = cell?.glow;
                
                return (
                  <div key={`${r}-${c}`} className="flex-1 border-[0.5px] border-[var(--hairline)] transition-colors duration-500 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className={`absolute inset-[1px] transition-all duration-300 ${isGlow ? 'opacity-100 scale-100 z-10' : 'opacity-80 scale-95 z-0'}`} 
                      style={{ 
                        backgroundColor: aff > 0.7 ? 'var(--signal)' : aff > 0.4 ? 'var(--signal-dim)' : 'transparent',
                        boxShadow: isGlow ? '0 0 10px var(--signal)' : 'none'
                      }} 
                    />
                    {isGlow && <div className="absolute inset-0 bg-white opacity-20 mix-blend-overlay z-20" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-24 flex flex-col pt-2 relative border-l border-[var(--hairline)] pl-3 text-[8px]">
          <div className="text-[var(--ink-secondary)] mb-2 uppercase">Predictions</div>
          <div className="text-[var(--signal)] mb-2 ">{USERS[scanRow]}</div>
          <div className="flex flex-col gap-1 text-[var(--ink-tertiary)] tracking-widest leading-relaxed">
            {activeRecs.map((rec, i) => (
              <motion.div 
                key={`${scanRow}-${rec}`}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="overflow-hidden whitespace-nowrap text-ellipsis"
              >
                {rec}
              </motion.div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-auto pb-2 flex gap-2 flex-col">
            <div className="flex items-center gap-1.5 opacity-60"><span className="w-1.5 h-1.5 bg-[var(--signal)]"/> {'>'} 0.7</div>
            <div className="flex items-center gap-1.5 opacity-60"><span className="w-1.5 h-1.5 bg-[var(--signal-dim)]"/> {'>'} 0.4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
