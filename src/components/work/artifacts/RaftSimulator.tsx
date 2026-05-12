"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  from: number;
  to: number;
  type: 'heartbeat' | 'vote';
}

export default function RaftSimulator() {
  const [leader, setLeader] = useState(0);
  const [state, setState] = useState<'stable' | 'election'>('stable');
  const [term, setTerm] = useState(14);
  const [particles, setParticles] = useState<Particle[]>([]);
  const pIdRef = useRef(0);
  
  // Use useMemo or state if changing nodes dynamically, here it's static
  const nodes = [0, 1, 2, 3, 4];

  useEffect(() => {
    
    // Heartbeats or Votes logic
    const interval = setInterval(() => {
      setParticles(prev => {
        let next = [...prev];
        if (state === 'stable') {
           // Leader sends heartbeats
           nodes.forEach(n => {
             if (n !== leader) {
               next.push({ id: pIdRef.current++, from: leader, to: n, type: 'heartbeat' });
             }
           });
        } else if (state === 'election') {
           // Random voting traffic
           const from = Math.floor(Math.random() * 5);
           let to = Math.floor(Math.random() * 5);
           while(to === from) to = Math.floor(Math.random() * 5);
           next.push({ id: pIdRef.current++, from, to, type: 'vote' });
        }
        return next.slice(-25); // Keep max 25 particles
      });
    }, state === 'stable' ? 800 : 200);

    return () => clearInterval(interval);
  }, [state, leader]);

  const killLeader = () => {
    if (state === 'election') return;
    setState('election');
    
    setTimeout(() => {
      setTerm(t => t + 1);
      let newLeader = Math.floor(Math.random() * 5);
      while (newLeader === leader) newLeader = Math.floor(Math.random() * 5);
      setLeader(newLeader);
      setState('stable');
    }, 2500);
  };

  // Node position calculation (Pentagon centered at x:50%, y:50%)
  const getPos = (n: number) => {
    const angle = (n / 5) * Math.PI * 2 - Math.PI / 2;
    const r = 35; // radius in %
    return {
      x: 50 + Math.cos(angle) * r,
      y: 50 + Math.sin(angle) * r,
    };
  };

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col font-mono relative overflow-hidden">
      <div className="flex justify-between items-center z-10 relative mb-4 text-[10px]">
        <span className="text-[var(--ink-secondary)] tracking-widest">RAFT CONSENSUS</span>
        <span className={`tabular-nums ${state === 'election' ? 'text-[var(--warn)]' : 'text-[var(--signal)]'}`}>
          TERM: {term}
        </span>
      </div>

      <div className="flex-grow relative flex items-center justify-center border border-[var(--hairline)] bg-[var(--bg-void)] shadow-inner">
        
        {/* Connection paths mapping */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
           {nodes.map(n1 => 
             nodes.map(n2 => {
               if (n1 >= n2) return null;
               const p1 = getPos(n1);
               const p2 = getPos(n2);
               return (
                 <line key={`${n1}-${n2}`} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="var(--hairline-bold)" strokeWidth="1" />
               );
             })
           )}
        </svg>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <AnimatePresence>
            {particles.map(p => {
               const start = getPos(p.from);
               const end = getPos(p.to);
               return (
                 <motion.div
                   key={p.id}
                   className={`absolute w-1.5 h-1.5 rounded-full -ml-[3px] -mt-[3px] ${
                     p.type === 'heartbeat' ? 'bg-[var(--signal)] shadow-[0_0_6px_var(--signal)]' : 'bg-[var(--warn)] shadow-[0_0_6px_var(--warn)]'
                   }`}
                   initial={{ left: `${start.x}%`, top: `${start.y}%`, opacity: 0 }}
                   animate={{ left: `${end.x}%`, top: `${end.y}%`, opacity: [0, 1, 0] }}
                   transition={{ duration: p.type === 'heartbeat' ? 0.6 : 0.3, ease: 'linear' }}
                   onAnimationComplete={() => setParticles(prev => prev.filter(x => x.id !== p.id))}
                 />
               );
            })}
          </AnimatePresence>
        </div>

        {/* Nodes */}
        {nodes.map(n => {
          const { x, y } = getPos(n);
          const isLeader = n === leader && state === 'stable';
          const isFailed = n === leader && state === 'election';

          return (
            <motion.div 
              key={n}
              className={`absolute w-10 h-10 flex flex-col items-center justify-center -ml-5 -mt-5 rounded-full border bg-[var(--bg-elevated)] transition-all duration-300 z-20 ${
                isLeader 
                  ? 'border-[var(--signal)] text-[var(--signal)] shadow-[0_0_15px_rgba(198,255,61,0.15)]' 
                  : isFailed
                  ? 'border-[var(--warn)] text-[var(--warn)] opacity-40 bg-[rgba(255,138,61,0.05)]'
                  : 'border-[var(--ink-tertiary)] text-[var(--ink-secondary)]'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={isLeader ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-[9px]">N{n}</div>
              {isLeader && <div className="text-[5px] mt-0.5 tracking-widest uppercase text-[var(--ink-primary)]">LEADER</div>}
            </motion.div>
          );
        })}
        
        {/* Status Overlay */}
        {state === 'election' && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--warn)] border border-[var(--warn)] bg-[rgba(255,138,61,0.1)] backdrop-blur-md px-3 py-1.5 z-30 text-[9px] tracking-widest uppercase animate-pulse shadow-[0_0_20px_rgba(255,138,61,0.2)]">
              Network Partition
           </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center z-10 relative">
        <span className="text-[8px] text-[var(--ink-tertiary)] opacity-60">HEARTBEAT: 800MS</span>
        <button 
          onClick={killLeader}
          disabled={state === 'election'}
          className="px-6 py-2.5 bg-[var(--ink-primary)] text-[var(--bg-void)] text-[9px] uppercase tracking-widest hover:bg-[var(--warn)] disabled:opacity-30 disabled:hover:bg-[var(--ink-primary)] transition-all duration-300 active:scale-95"
        >
          {state === 'election' ? 'RE-ELECTING...' : 'KILL LEADER'}
        </button>
      </div>
    </div>
  );
}
