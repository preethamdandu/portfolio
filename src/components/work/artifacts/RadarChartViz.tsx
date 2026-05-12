"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const axes = ['latency', 'throughput', 'error_rate', 'cpu_util', 'mem_load'];
const baseScores = [92, 88, 95, 82, 78];
const baselineScores = [65, 60, 55, 50, 45];

export default function RadarChartViz() {
  const [metrics, setMetrics] = useState([...baseScores]);
  const [bars, setBars] = useState([78, 65, 52]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Jitter metrics
      setMetrics(prev => prev.map((score, i) => {
        const target = baseScores[i];
        let next = score + (Math.random() - 0.5) * 12; // jitter
        // Keep within bounds and close to target
        next = next + (target - next) * 0.2;
        return Math.max(30, Math.min(100, next));
      }));

      // Jitter bars
      setBars(prev => prev.map((v) => {
        let next = v + (Math.random() - 0.5) * 8;
        return Math.max(20, Math.min(95, next));
      }));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const cx = 50, cy = 50, maxR = 38;
  const getPoint = (axisIdx: number, value: number) => {
    const angle = (axisIdx / axes.length) * Math.PI * 2 - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const currentPoints = axes.map((_, i) => getPoint(i, metrics[i]));
  const basePoints = axes.map((_, i) => getPoint(i, baselineScores[i]));
  const currentPath = currentPoints.map(p => `${p.x},${p.y}`).join(' ');
  const basePath = basePoints.map(p => `${p.x},${p.y}`).join(' ');

  const nodes = [
    { label: 'NODE-A', color: 'var(--signal)' },
    { label: 'NODE-B', color: 'var(--tag-swe)' },
    { label: 'NODE-C', color: 'var(--warn)' },
  ];

  return (
    <div className="w-full h-full p-6 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col overflow-hidden relative font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 text-[10px] text-[var(--ink-secondary)]">
        <span>K8S CLUSTER · TELEMETRY RADAR</span>
        <span className="text-[var(--signal)] flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[var(--signal)] rounded-full animate-pulse-signal" />
          LIVE SYNC
        </span>
      </div>

      {/* Radar chart */}
      <div className="flex-grow flex items-center justify-center gap-6">
        <div className="relative" style={{ width: '55%', aspectRatio: '1' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map(scale => (
              <polygon
                key={scale}
                points={axes.map((_, i) => {
                  const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
                  const r = maxR * scale;
                  return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
                }).join(' ')}
                fill="none"
                stroke="var(--hairline)"
                strokeWidth="0.3"
                strokeDasharray="1 1"
              />
            ))}

            {/* Axis lines */}
            {axes.map((_, i) => {
              const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * maxR} y2={cy + Math.sin(angle) * maxR} stroke="var(--hairline)" strokeWidth="0.3" strokeDasharray="2 2" />
              );
            })}

            {/* Baseline polygon */}
            <polygon points={basePath} fill="rgba(150,150,150,0.05)" stroke="var(--ink-tertiary)" strokeWidth="0.3" strokeDasharray="1 1" />
            
            {/* Active telemetry polygon */}
            <motion.polygon 
              points={currentPath} 
              fill="rgba(198,255,61,0.15)" 
              stroke="var(--signal)" 
              strokeWidth="0.8"
              animate={{ points: currentPath }}
              transition={{ ease: "linear", duration: 0.5 }}
            />

            {/* Axis labels */}
            {axes.map((label, i) => {
              const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
              const lx = cx + Math.cos(angle) * (maxR + 8);
              const ly = cy + Math.sin(angle) * (maxR + 8);
              return (
                <text key={label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="var(--ink-tertiary)" fontSize="3.5" fontFamily="monospace" className="uppercase tracking-widest">
                  {label}
                </text>
              );
            })}
          </svg>

          <div className="absolute bottom-0 left-0 flex gap-3 text-[7px] tracking-widest">
            <span className="text-[var(--signal)]">● ACTIVE NODE</span>
            <span className="text-[var(--ink-tertiary)]">● THRESHOLD</span>
          </div>
        </div>

        {/* Node bar chart */}
        <div className="flex flex-col gap-2.5 w-24">
          <div className="text-[7px] tracking-widest text-[var(--ink-tertiary)] mb-1">NODE UTILIZATION</div>
          {nodes.map((node, i) => (
            <div key={node.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-[7px] tracking-wider">
                <span className="text-[var(--ink-secondary)]">{node.label}</span>
                <span style={{ color: node.color }}>{Math.round(bars[i])}%</span>
              </div>
              <div className="h-1.5 bg-[var(--bg-void)] border border-[var(--hairline)] rounded-sm overflow-hidden">
                <motion.div 
                  className="h-full rounded-sm" 
                  style={{ backgroundColor: node.color }}
                  animate={{ width: `${bars[i]}%` }}
                  transition={{ ease: "linear", duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[8px] text-[var(--ink-tertiary)] mt-2">
        <span>SAMPLING: 500MS</span>
        <span>AGENT V3.4</span>
      </div>
    </div>
  );
}
