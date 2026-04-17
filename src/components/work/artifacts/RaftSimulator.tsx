"use client";

import { useState, useEffect } from 'react';

export default function RaftSimulator() {
  const [leader, setLeader] = useState(0);
  const [state, setState] = useState<'stable' | 'election'>('stable');
  const [term, setTerm] = useState(14);
  const nodes = [0, 1, 2, 3, 4];

  const killLeader = () => {
    if (state === 'election') return;
    setState('election');
    
    // Simulate election timeout and voting
    setTimeout(() => {
      setTerm(t => t + 1);
      // Pick new leader != old leader
      let newLeader = Math.floor(Math.random() * 5);
      while (newLeader === leader) newLeader = Math.floor(Math.random() * 5);
      setLeader(newLeader);
      setState('stable');
    }, 1500);
  };

  return (
    <div className="w-full h-full p-8 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col items-center justify-center font-mono relative">
      <div className="absolute top-6 left-6 text-xs text-[var(--ink-secondary)]">TERM: {term}</div>
      <div className="absolute top-6 right-6 text-xs text-[var(--warn)]">
        {state === 'election' ? 'ELECTION IN PROGRESS...' : `STABLE (LEADER: N${leader})`}
      </div>

      <div className="relative w-48 h-48 mb-8">
        {nodes.map(n => {
          const angle = (n / 5) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 70 + 80;
          const y = Math.sin(angle) * 70 + 80;
          const isLeader = n === leader;
          const isFailed = state === 'election' && isLeader;

          return (
            <div 
              key={n}
              className={`absolute w-12 h-12 flex items-center justify-center -ml-6 -mt-6 rounded-full border transition-all duration-300 ${
                isLeader 
                  ? 'border-[var(--signal)] text-[var(--signal)] drop-shadow-[0_0_8px_rgba(198,255,61,0.3)]' 
                  : isFailed
                  ? 'border-[var(--warn)] text-[var(--warn)] opacity-50'
                  : 'border-[var(--ink-tertiary)] text-[var(--ink-secondary)]'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              N{n}
            </div>
          );
        })}
      </div>

      <button 
        onClick={killLeader}
        disabled={state === 'election'}
        className="px-4 py-2 text-xs uppercase tracking-widest border border-[var(--ink-secondary)] hover:border-[var(--warn)] hover:text-[var(--warn)] disabled:opacity-50 transition-colors"
      >
        Kill Leader
      </button>
    </div>
  );
}
