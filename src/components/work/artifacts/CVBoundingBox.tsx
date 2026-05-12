"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BBox {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  conf: number;
  color: string;
  dx: number;
  dy: number;
  trail: {x: number, y: number}[];
}

export default function CVBoundingBox() {
  const [boxes, setBoxes] = useState<BBox[]>([]);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const initial: BBox[] = [
      { id: 1, x: 20, y: 30, w: 8, h: 12, conf: 0.94, color: 'var(--signal)', dx: 0.5, dy: 0.2, trail: [] },
      { id: 2, x: 60, y: 50, w: 7, h: 11, conf: 0.87, color: 'var(--warn)', dx: -0.4, dy: 0.3, trail: [] },
      { id: 3, x: 80, y: 35, w: 9, h: 14, conf: 0.91, color: 'var(--signal-dim)', dx: -0.3, dy: -0.2, trail: [] },
    ];
    setBoxes(initial);

    // Smooth physics movement
    const moveInterval = setInterval(() => {
      setBoxes(prev => prev.map(b => {
        // Simple bounding box collision with soft boundaries
        let nextDx = b.dx;
        let nextDy = b.dy;
        if (b.x < 10) nextDx = Math.abs(b.dx) + 0.1;
        if (b.x > 80) nextDx = -Math.abs(b.dx) - 0.1;
        if (b.y < 10) nextDy = Math.abs(b.dy) + 0.1;
        if (b.y > 65) nextDy = -Math.abs(b.dy) - 0.1;

        // Add some noise to velocity
        nextDx += (Math.random() - 0.5) * 0.15;
        nextDy += (Math.random() - 0.5) * 0.15;

        // Dampen max speed
        nextDx = Math.max(-0.8, Math.min(0.8, nextDx));
        nextDy = Math.max(-0.8, Math.min(0.8, nextDy));

        const nextX = b.x + nextDx;
        const nextY = b.y + nextDy;

        // Manage trail (store center bottom point)
        const center = { x: nextX + b.w/2, y: nextY + b.h };
        const newTrail = [...b.trail, center].slice(-30); // Keep last 30 frames

        return {
          ...b,
          x: nextX,
          y: nextY,
          dx: nextDx,
          dy: nextDy,
          conf: Math.min(0.99, Math.max(0.7, b.conf + (Math.random() - 0.5) * 0.03)),
          trail: newTrail,
        };
      }));
      setFrame(f => f + 1);
    }, 50); // ~20 FPS

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[10px]">
        <span className="text-[var(--ink-secondary)]">MATCHDAY AI · MOT PIPELINE</span>
        <div className="flex gap-4">
          <span className="text-[var(--ink-tertiary)]">FRAME: {String(frame).padStart(5, '0')}</span>
          <span className="text-[var(--signal)] flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[var(--signal)] rounded-full animate-pulse-signal" />
            LIVE ALIGN
          </span>
        </div>
      </div>

      {/* Camera frame */}
      <div className="flex-grow relative border border-[var(--hairline-bold)] bg-[var(--bg-void)] overflow-hidden rounded-sm inner-shadow">
        
        {/* Simple stadium background lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
           {/* Center circle */}
           <circle cx="50" cy="50" r="25" fill="none" stroke="var(--ink-tertiary)" strokeWidth="0.5" />
           <line x1="50" y1="0" x2="50" y2="100" stroke="var(--ink-tertiary)" strokeWidth="0.5" />
           {/* Penalty boxes */}
           <rect x="0" y="25" width="20" height="50" fill="none" stroke="var(--ink-tertiary)" strokeWidth="0.5" />
           <rect x="80" y="25" width="20" height="50" fill="none" stroke="var(--ink-tertiary)" strokeWidth="0.5" />
           
           {/* Trails */}
           {boxes.map(box => {
             if (box.trail.length < 2) return null;
             const pathData = `M ${box.trail[0].x} ${box.trail[0].y} ` + box.trail.map(t => `L ${t.x} ${t.y}`).join(' ');
             return (
               <path 
                 key={`trail-${box.id}`}
                 d={pathData} 
                 fill="none" 
                 stroke={box.color} 
                 strokeWidth="0.5" 
                 opacity="0.6" 
                 strokeDasharray="2 1"
               />
             );
           })}
        </svg>

        {/* Bounding boxes */}
        {boxes.map(box => (
          <div
            key={box.id}
            className="absolute z-10"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
              border: `1.5px solid ${box.color}`,
              boxShadow: `inset 0 0 10px ${box.color}20, 0 0 10px ${box.color}20`,
            }}
          >
            {/* Box Header Label */}
            <div 
              className="absolute -top-[14px] left-[-1.5px] px-1 flex items-center gap-1 text-[7px] whitespace-nowrap" 
              style={{ color: 'var(--bg-void)', backgroundColor: box.color }}
            >
              <span className="font-bold tracking-widest">ID:{box.id}</span>
              <span>{box.conf.toFixed(2)}</span>
            </div>
            
            {/* Center crosshair projection */}
            <div className="absolute left-1/2 bottom-0 w-2 h-2 -ml-1 -mb-1 border border-[var(--bg-void)] rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: box.color }}>
               <div className="w-[1px] h-[1px] bg-white rounded-full"/>
            </div>
          </div>
        ))}
        
        {/* Field of View Arc */}
        <svg className="absolute inset-x-0 bottom-0 w-full h-[50%] pointer-events-none opacity-30" viewBox="0 0 100 50" preserveAspectRatio="none">
           <path d="M 10 50 C 30 10, 70 10, 90 50" fill="none" stroke="var(--signal)" strokeWidth="0.2" strokeDasharray="3 3" />
           <path d="M 0 50 C 20 -10, 80 -10, 100 50" fill="none" stroke="var(--signal)" strokeWidth="0.1" strokeDasharray="1 2" />
        </svg>

        {/* Reticles */}
        <div className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 border border-[var(--ink-secondary)] rounded-full opacity-20 flex items-center justify-center">
           <div className="w-1 h-1 bg-[var(--ink-secondary)] rounded-full" />
           <div className="absolute inset-0 border border-dotted border-[var(--ink-secondary)] rounded-full scale-125 animate-spin-slow" />
        </div>
      </div>

      {/* Detection stats */}
      <div className="flex gap-5 mt-3 text-[8px] text-[var(--ink-tertiary)] font-mono">
        <span>TRACKS: {boxes.length}</span>
        <span>ALGO: ByteTrack + ReID</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
