"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  isPath?: boolean;
}

interface Edge {
  source: number;
  target: number;
  isPath?: boolean;
}

export default function NeuroSearchTrace() {
  const [activeStep, setActiveStep] = useState(0); // 0=idle, 1=expand, 2=path find

  // Static graph generation for visual consistency
  const nodes: Node[] = [
    { id: 0, x: 50, y: 50, label: 'QUERY', isPath: true }, // center
    { id: 1, x: 30, y: 30, label: 'e_72', isPath: true },
    { id: 2, x: 70, y: 25, label: 'e_14', isPath: false },
    { id: 3, x: 80, y: 60, label: 'e_99', isPath: false },
    { id: 4, x: 25, y: 70, label: 'e_03', isPath: false },
    { id: 5, x: 20, y: 15, label: 'e_88', isPath: true },
    { id: 6, x: 60, y: 80, label: 'e_51', isPath: false },
    { id: 7, x: 10, y: 40, label: 'e_42', isPath: false },
    { id: 8, x: 85, y: 35, label: 'e_11', isPath: false },
    { id: 9, x: 45, y: 10, label: 'e_01', isPath: true },
  ];

  const edges: Edge[] = [
    { source: 0, target: 1, isPath: true },
    { source: 0, target: 2 },
    { source: 0, target: 4 },
    { source: 0, target: 6 },
    { source: 0, target: 3 },
    { source: 1, target: 5, isPath: true },
    { source: 1, target: 7 },
    { source: 2, target: 8 },
    { source: 5, target: 9, isPath: true },
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4; // 0->1->2->wait->0
      setActiveStep(step === 3 ? 0 : step);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col font-mono text-[var(--ink-secondary)]">
      <div className="flex justify-between items-center mb-4 text-[10px] z-10 relative bg-[var(--bg-sunken)] min-h-[16px]">
        <span>AETHER CAP · KNOWLEDGE GRAPH TRACE</span>
        <span className="text-[var(--signal)]">
          {activeStep === 0 ? 'AWAITING QUERY' : activeStep === 1 ? 'EXPANDING TREE...' : 'OPTIMAL PATH FOUND'}
        </span>
      </div>

      <div className="flex-grow flex flex-col relative border border-[var(--hairline)] bg-[var(--bg-void)] overflow-hidden">
        
        {/* Background Grid */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hex" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <path d="M5 0 l 5 2.88 v 5.77 l -5 2.88 l -5 -2.88 v -5.77 Z" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#hex)" />

          {/* Edges */}
          {edges.map((e, idx) => {
            const src = nodes.find(n => n.id === e.source)!;
            const tgt = nodes.find(n => n.id === e.target)!;
            const showEdge = activeStep >= 1;
            const isHighlighted = activeStep >= 2 && e.isPath;
            
            return (
              <motion.line
                key={`e-${idx}`}
                x1={src.x} y1={src.y}
                x2={tgt.x} y2={tgt.y}
                stroke={isHighlighted ? 'var(--signal)' : 'var(--ink-tertiary)'}
                strokeWidth={isHighlighted ? "0.8" : "0.3"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: showEdge ? 1 : 0, opacity: showEdge ? (isHighlighted ? 1 : 0.3) : 0 }}
                transition={{ duration: isHighlighted ? 0.8 : 0.4 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(n => {
          const isCenter = n.id === 0;
          const showNode = isCenter || activeStep >= 1;
          const isHighlighted = activeStep >= 2 && n.isPath;
          const isFaded = activeStep >= 2 && !n.isPath;

          return (
            <motion.div
              key={n.id}
              className={`absolute rounded-full flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                isCenter ? 'z-20' : 'z-10'
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: showNode ? (isCenter ? 1.5 : 1) : 0, 
                opacity: showNode ? (isFaded && !isCenter ? 0.2 : 1) : 0 
              }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              <div className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                isCenter ? 'bg-[var(--signal-glow)] border-[var(--signal)]' : 
                isHighlighted ? 'bg-[var(--signal)] border-[var(--signal)] shadow-[0_0_8px_var(--signal)]' : 
                'bg-[var(--bg-elevated)] border-[var(--ink-tertiary)]'
              }`} />
              
              {showNode && !isFaded && (
                <div className={`mt-1 text-[5px] absolute top-full transition-colors whitespace-nowrap ${
                  isHighlighted || isCenter ? 'text-[var(--signal)]' : 'text-[var(--ink-secondary)]'
                }`}>
                  {n.label}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Path Label Tooltip */}
        <AnimatePresence>
          {activeStep >= 2 && (
            <motion.div 
              className="absolute top-4 right-4 bg-[var(--bg-elevated)] border border-[var(--signal)] p-2 z-30 shadow-lg"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-[6px] tracking-widest text-[var(--signal)] border-b border-[var(--signal)] border-opacity-30 pb-1 mb-1">
                OPTIMAL TRAVERSAL
              </div>
              <div className="text-[7px] text-[var(--ink-secondary)]">Depth: 3 edges</div>
              <div className="text-[7px] text-[var(--ink-secondary)]">Conf: 0.982</div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Footer / Status bar */}
      <div className="flex justify-between text-[8px] text-[var(--ink-tertiary)] mt-3">
        <span>KNOWLEDGE GRAPH DIMENSION: 1024</span>
        <span>LATENCY: 14ms</span>
      </div>
    </div>
  );
}
