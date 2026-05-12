"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Generate static clusters outside render to avoid hydration logic needed for random
const CLUSTERS = [
  { cx: 20, cy: 30, color: 'var(--tag-swe)', count: 12 },
  { cx: 75, cy: 40, color: 'var(--tag-backend)', count: 15 },
  { cx: 45, cy: 75, color: 'var(--warn)', count: 10 },
  { cx: 85, cy: 80, color: 'var(--tag-ai)', count: 8 },
];

interface Point {
  id: string;
  x: number;
  y: number;
  clusterIdx: number;
  color: string;
  dist?: number;
}

// Deterministic random
const mulberry32 = (a: number) => {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function DocumentPipeline() {
  const [queryPos, setQueryPos] = useState({ x: 50, y: 50 });
  const [activeNeighbors, setActiveNeighbors] = useState<Point[]>([]);
  const [matchScore, setMatchScore] = useState(0);

  const points = useMemo(() => {
    const rnd = mulberry32(12345);
    const pts: Point[] = [];
    CLUSTERS.forEach((c, idx) => {
      for (let i = 0; i < c.count; i++) {
        // Gaussian-ish distribution around cluster center
        const x = Math.max(5, Math.min(95, c.cx + (rnd() - 0.5) * 25 + (rnd() - 0.5) * 15));
        const y = Math.max(5, Math.min(95, c.cy + (rnd() - 0.5) * 25 + (rnd() - 0.5) * 15));
        pts.push({ id: `c${idx}-p${i}`, x, y, clusterIdx: idx, color: c.color });
      }
    });
    return pts;
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number;

    const animate = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;
      const progress = (elapsed / 12000) % 1; // 12 second cycle

      // Create a smooth wandering path for the query
      const x = 50 + Math.sin(progress * Math.PI * 2) * 35 + Math.cos(progress * Math.PI * 6) * 10;
      const y = 50 + Math.cos(progress * Math.PI * 2) * 35 + Math.sin(progress * Math.PI * 4) * 10;
      
      setQueryPos({ x, y });

      // Find nearest 5 neighbors
      const withDist = points.map(p => {
        const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
        return { ...p, dist };
      });
      withDist.sort((a, b) => a.dist - b.dist);
      const nearest = withDist.slice(0, 5);
      
      setActiveNeighbors(nearest);

      // Match score based on closeness
      const closestDist = nearest[0]?.dist || 100;
      const score = Math.max(0, 0.99 - (closestDist / 40));
      setMatchScore(score);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [points]);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[10px] text-[var(--ink-secondary)] relative z-10 w-full bg-[var(--bg-sunken)]">
        <span>FINSIGNAL · VECTOR SEARCH</span>
        <span className="text-[var(--signal)]">NDCG@10: 0.78</span>
      </div>

      {/* Main Scatter Plot Canvas */}
      <div className="flex-grow relative border border-[var(--hairline)] bg-[var(--bg-void)] overflow-hidden">
        
        {/* SVG layer for drawing lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines styling */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
             <line x1="10" y1="0" x2="10" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
             <line x1="0" y1="10" x2="10" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Connection lines from query to nearest neighbors */}
          {activeNeighbors.map(n => (
            <line 
              key={`line-${n.id}`}
              x1={queryPos.x} 
              y1={queryPos.y} 
              x2={n.x} 
              y2={n.y} 
              stroke={n.color} 
              strokeWidth="0.4"
              strokeOpacity="0.8"
              strokeDasharray="1 1"
            />
          ))}
        </svg>

        {/* The data points */}
        {points.map(p => {
          const isActive = activeNeighbors.find(n => n.id === p.id);
          return (
            <div
              key={p.id}
              className={`absolute rounded-full transition-all duration-[50ms] ${isActive ? 'z-20' : 'z-10 opacity-40'}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: isActive ? '5px' : '3px',
                height: isActive ? '5px' : '3px',
                backgroundColor: p.color,
                marginLeft: isActive ? '-2.5px' : '-1.5px',
                marginTop: isActive ? '-2.5px' : '-1.5px',
                boxShadow: isActive ? `0 0 8px ${p.color}` : 'none'
              }}
            />
          );
        })}

        {/* The Query Vector (Crosshair) */}
        <div 
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${queryPos.x}%`,
            top: `${queryPos.y}%`,
            width: '16px',
            height: '16px',
            marginLeft: '-8px',
            marginTop: '-8px',
          }}
        >
          <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
          
          {/* Pulse effect */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-[var(--signal)]"
            animate={{ scale: [1, 2], opacity: [0.8, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Floating Tooltip */}
          {matchScore > 0.8 && (
            <div className="absolute top-3 left-3 bg-[var(--bg-elevated)] border border-[var(--signal)] px-1.5 py-0.5 text-[7px] text-[var(--signal)] whitespace-nowrap shadow-lg">
              sim: {matchScore.toFixed(3)}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Status bar */}
      <div className="flex justify-between text-[8px] text-[var(--ink-tertiary)] mt-3">
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--tag-swe)]"/> LEGAL</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--tag-backend)]"/> FIN</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--warn)]"/> NEWS</span>
        </div>
        <span>{points.length} VECTORS</span>
      </div>
    </div>
  );
}

