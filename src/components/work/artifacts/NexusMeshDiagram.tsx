"use client";

import { useEffect, useState } from 'react';

export default function NexusMeshDiagram() {
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulses(prev => {
        // keep up to 4 pulses, add a new one randomly 0-5
        const next = [...prev, Math.floor(Math.random() * 5)];
        if (next.length > 3) next.shift();
        return next;
      });
    }, 600);
    return () => clearInterval(pulseInterval);
  }, []);

  const nodes = [
    { id: 'gateway', x: 50, y: 20 },
    { id: 'auth-svc', x: 20, y: 50 },
    { id: 'order-svc', x: 80, y: 50 },
    { id: 'pricing-svc', x: 35, y: 80 },
    { id: 'ledger-svc', x: 65, y: 80 },
  ];

  return (
    <div className="w-full h-full border border-[var(--hairline)] bg-[var(--bg-sunken)] p-8 relative flex items-center justify-center">
      <svg className="w-full h-full absolute inset-0 mix-blend-screen" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw edges */}
        {[
          [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2]
        ].map((edge, idx) => (
          <g key={idx}>
            <line 
              x1={`${nodes[edge[0]].x}%`} y1={`${nodes[edge[0]].y}%`} 
              x2={`${nodes[edge[1]].x}%`} y2={`${nodes[edge[1]].y}%`} 
              stroke="var(--hairline-bold)" strokeWidth="0.5" 
            />
            {/* Active gRPC "call" pulse */}
            {pulses.includes(idx) && (
              <circle cx={`${nodes[edge[1]].x}%`} cy={`${nodes[edge[1]].y}%`} r="2">
                <animate attributeName="opacity" values="1;0" dur="0.6s" />
                <animate attributeName="r" values="0;10" dur="0.6s" />
                <animate attributeName="stroke" values="var(--signal);var(--signal)" dur="0.6s" />
              </circle>
            )}
          </g>
        ))}
        {/* Draw nodes */}
        {nodes.map((node, i) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Mock prometheus sparklines above node */}
            <polyline 
              points="-5,-15 -2,-10 0,-12 3,-18 5,-14" 
              fill="none" 
              stroke={i === 2 ? 'var(--warn)' : 'var(--signal)'} 
              strokeWidth="0.5" 
              className={i === 2 ? "animate-pulse" : ""}
            />
            <rect x="-8" y="-5" width="16" height="10" fill="var(--bg-elevated)" stroke="var(--ink-tertiary)" strokeWidth="0.5" rx="1" />
            <text x="0" y="1" fontSize="3" fill="var(--ink-secondary)" textAnchor="middle" fontFamily="monospace" dominantBaseline="middle">
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
