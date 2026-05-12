"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
}

export default function MessageQueueFlow() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [throughput, setThroughput] = useState(1280);
  const [consumed, setConsumed] = useState(842000);
  const pIdRef = useRef(0);

  useEffect(() => {
    
    // Spawn particles rapidly
    const spawnTimer = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-30), // keep max 30 for perf
        { id: pIdRef.current++ }
      ]);
      setThroughput(1280 + Math.random() * 200 - 100);
      setConsumed(c => c + Math.floor(Math.random() * 5));
    }, 150);

    return () => {
      clearInterval(spawnTimer);
    };
  }, []);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col font-mono text-[var(--ink-secondary)] overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 text-[10px] pb-4 border-b border-[var(--hairline)]">
        <span>PETNOTIFY · SQ/SNS MESSAGE PIPELINE</span>
        <span className="text-[var(--signal)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[var(--signal)] rounded-full animate-pulse-signal" />
          {throughput.toFixed(0)} MSG/S
        </span>
      </div>

      <div className="flex-grow flex items-center justify-between relative px-2">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-8 right-8 h-px bg-[var(--hairline-bold)] -translate-y-1/2" />
        
        {/* Stages */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-[var(--hairline-bold)] bg-[var(--bg-void)] flex items-center justify-center mb-2 z-10 relative">
             <span className="text-[14px]">📱</span>
          </div>
          <span className="text-[8px] tracking-widest text-[var(--ink-tertiary)]">SNS TOPIC</span>
        </div>

        <div className="z-10 flex flex-col items-center relative">
          {/* Queue visual: stack of lines */}
          <div className="w-16 h-12 border border-[var(--signal)] bg-[var(--bg-void)] flex flex-col justify-center px-2 py-1.5 gap-1 mb-2 shadow-[0_0_15px_rgba(198,255,61,0.05)] z-10">
            {Array.from({length: 4}).map((_, i) => (
               <motion.div 
                 key={i} 
                 className="h-[2px] bg-[var(--signal)]"
                 initial={{ width: '40%' }}
                 animate={{ width: `${40 + Math.random() * 60}%` }}
                 transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
               />
            ))}
          </div>
          <span className="text-[8px] tracking-widest text-[var(--signal)]">SQS BUFFER</span>
          <div className="absolute -bottom-4 text-[7px] text-[var(--warn)]">DEPTH: 14.2k</div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-[var(--hairline-bold)] bg-[var(--bg-void)] flex flex-wrap gap-1 p-2.5 items-center justify-center mb-2 z-10 relative">
             <div className="w-2.5 h-2.5 bg-[var(--ink-primary)] opacity-80" />
             <div className="w-2.5 h-2.5 bg-[var(--ink-primary)] opacity-80" />
             <div className="w-2.5 h-2.5 bg-[var(--warn)] opacity-80" />
             <div className="w-2.5 h-2.5 bg-[var(--ink-primary)] opacity-80" />
          </div>
          <span className="text-[8px] tracking-widest text-[var(--ink-tertiary)]">CONSUMERS</span>
        </div>

        {/* Particles wrapping container */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence>
            {particles.map(p => {
               // Add slight y jitter
               const yOffset = (p.id % 2 === 0 ? 1 : -1) * (Math.random() * 4);

               return (
                 <motion.div
                   key={p.id}
                   className="absolute w-1.5 h-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_6px_var(--signal)]"
                   initial={{ left: '10%', top: `calc(50% + ${yOffset}px)`, opacity: 0, scale: 0 }}
                   animate={{ 
                     left: '90%', 
                     opacity: [0, 1, 1, 0],
                     scale: [0.5, 1, 1, 0.5] 
                   }}
                   transition={{ duration: 1.8, ease: "linear" }}
                   onAnimationComplete={() => {
                     setParticles(prev => prev.filter(x => x.id !== p.id));
                   }}
                 />
               );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer stats */}
      <div className="flex justify-between text-[8px] text-[var(--ink-tertiary)] mt-2">
        <span>PROCESSED: {consumed.toLocaleString()}</span>
        <span>DEAD LETTER QUEUE: 0</span>
      </div>
    </div>
  );
}
