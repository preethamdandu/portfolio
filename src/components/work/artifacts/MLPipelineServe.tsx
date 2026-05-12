"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  targetNode: number; // 0, 1, 2
}

export default function MLPipelineServe() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [failedNode, setFailedNode] = useState<number | null>(null);
  const [latencyBars, setLatencyBars] = useState<number[]>(Array(16).fill(20));
  const pIdRef = useRef(0);

  useEffect(() => {
    // We cannot access latest failedNode directly inside the interval if we don't use a ref, 
    // but the effect dependency handles it. However, the interval is cleared and recreated every time failedNode changes.
    // That is fine for this visual.
    
    const generateParticle = () => {
      let target = Math.floor(Math.random() * 3);
      if (failedNode !== null && target === failedNode) {
        target = (target + 1) % 3;
        if (target === failedNode) target = (target + 1) % 3;
      }
      setParticles(prev => [...prev.slice(-15), { id: pIdRef.current++, targetNode: target }]);
      
      setLatencyBars(prev => {
        const next = [...prev.slice(1)];
        let newLat = 20 + Math.random() * 10;
        if (failedNode !== null) newLat += 40 + Math.random() * 20;
        next.push(newLat);
        return next;
      });
    };

    const particleInterval = setInterval(generateParticle, 250);

    return () => clearInterval(particleInterval);
  }, [failedNode]);

  useEffect(() => {
    const failInterval = setInterval(() => {
      setFailedNode(1);
      setTimeout(() => {
        setFailedNode(null);
      }, 3000);
    }, 7000);

    return () => clearInterval(failInterval);
  }, []);

  const gatewayPos = { x: 30, y: 50 };
  const getOutNode = (idx: number) => {
    const angle = (idx - 1) * Math.PI / 4; // -45deg, 0, +45deg
    return {
      x: gatewayPos.x + 45 * Math.cos(angle),
      y: gatewayPos.y + 35 * Math.sin(angle),
      label: ['sklearn', 'tensorflow', 'xgboost'][idx]
    };
  };

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      <div className="flex justify-between items-center mb-4 text-[10px] text-[var(--ink-secondary)]">
        <span>HCLTECH · ML SERVING INFRASTRUCTURE</span>
        <span className={failedNode !== null ? 'text-[var(--warn)]' : 'text-[var(--signal)]'}>
          {failedNode !== null ? '⚠ REROUTING TRAFFIC...' : '● ALL SYSTEMS ONLINE'}
        </span>
      </div>

      <div className="flex-grow relative border border-[var(--hairline)] bg-[var(--bg-void)]">
        {/* Node connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[0, 1, 2].map(idx => {
            const out = getOutNode(idx);
            const isFailed = failedNode === idx;
            return (
              <line
                key={`line-${idx}`}
                x1={gatewayPos.x} y1={gatewayPos.y}
                x2={out.x} y2={out.y}
                stroke={isFailed ? 'var(--warn)' : 'var(--hairline)'}
                strokeWidth="0.5"
                strokeDasharray={isFailed ? "1 2" : "none"}
                opacity={isFailed ? 0.3 : 1}
              />
            );
          })}
          <line x1="0" y1={gatewayPos.y} x2={gatewayPos.x} y2={gatewayPos.y} stroke="var(--hairline)" strokeWidth="0.5" />
        </svg>

        {/* Gateway Node */}
        <div className="absolute w-12 h-12 border border-[var(--signal)] bg-[var(--bg-elevated)] flex flex-col items-center justify-center rounded-full z-10 shadow-[0_0_15px_rgba(198,255,61,0.1)]"
             style={{ left: `${gatewayPos.x}%`, top: `${gatewayPos.y}%`, transform: 'translate(-50%, -50%)' }}>
          <span className="text-[6px] text-[var(--ink-tertiary)] tracking-widest">N-GINX</span>
          <span className="text-[7px] text-[var(--signal)] mt-0.5">GATEWAY</span>
        </div>

        {/* Model Nodes */}
        {[0, 1, 2].map(idx => {
          const out = getOutNode(idx);
          const isFailed = failedNode === idx;
          return (
            <div key={`node-${idx}`} 
                 className={`absolute w-16 h-8 border flex items-center justify-center rounded-sm transition-colors duration-300 z-10 ${
                   isFailed ? 'border-[var(--warn)] bg-[rgba(255,138,61,0.1)] text-[var(--warn)]' : 'border-[var(--hairline-bold)] bg-[var(--bg-elevated)] text-[var(--ink-secondary)]'
                 }`}
                 style={{ left: `${out.x}%`, top: `${out.y}%`, transform: 'translate(-50%, -50%)' }}>
               <span className="text-[7px] tracking-wider font-bold">{out.label}</span>
            </div>
          );
        })}

        {/* Particles */}
        <AnimatePresence>
          {particles.map(p => {
            const targetPos = getOutNode(p.targetNode);
            return (
              <motion.div
                key={p.id}
                className="absolute w-1.5 h-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_6px_var(--signal)] z-0"
                initial={{ left: '0%', top: `${gatewayPos.y}%`, opacity: 0 }}
                animate={{
                  left: ['0%', `${gatewayPos.x}%`, `${targetPos.x}%`],
                  top: [`${gatewayPos.y}%`, `${gatewayPos.y}%`, `${targetPos.y}%`],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 0.6, ease: "linear" }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Latency Histogram */}
      <div className="mt-3 flex items-end gap-[3px] h-8 justify-end text-[8px] text-[var(--ink-tertiary)]">
        <span className="mr-3 self-center tracking-widest">SERVER LATENCY</span>
        {latencyBars.map((h, i) => (
          <div key={i} className="w-1.5 rounded-t-sm transition-all duration-300" style={{
            height: `${h}%`,
            backgroundColor: h > 40 ? 'var(--warn)' : 'var(--signal-dim)'
          }} />
        ))}
      </div>
    </div>
  );
}
