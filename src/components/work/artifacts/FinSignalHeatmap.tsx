"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function FinSignalHeatmap() {
  const [cells, setCells] = useState<{ id: string, val: number, ticker: string }[]>([]);
  const tickers = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'AMD'];

  useEffect(() => {
    // Generate simple 8x6 grid
    const newCells = [];
    for (let i = 0; i < 48; i++) {
      newCells.push({
        id: `cell-${i}`,
        val: (Math.random() * 2) - 1, // -1 to 1
        ticker: tickers[i % tickers.length]
      });
    }
    setCells(newCells);

    // Randomly update cells to look "live"
    const interval = setInterval(() => {
      setCells(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        updated[idx] = { ...updated[idx], val: (Math.random() * 2) - 1 };
        return updated;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const getColor = (val: number) => {
    // val is -1 to 1. Map to red -> gray -> signal green
    if (val < -0.3) return `rgba(255, 138, 61, ${Math.abs(val)})`; // warn
    if (val > 0.3) return `rgba(198, 255, 61, ${val})`; // signal
    return `var(--hairline-bold)`; // neutral
  };

  return (
    <div className="w-full h-full p-8 border border-[var(--hairline)] bg-[var(--bg-sunken)] flex flex-col justify-between overflow-hidden relative">
      <div className="flex justify-between items-center bg-[var(--bg-elevated)] p-3 border border-[var(--hairline)] mb-4 font-mono text-[10px] text-[var(--ink-secondary)]">
        <span>MODEL: FINBERT-LITE</span>
        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[var(--warn)] rounded-full animate-pulse-signal"></div>STREAM: LIVE</span>
      </div>
      
      <div className="grid grid-cols-8 gap-1 flex-grow">
        {cells.map((cell) => (
          <motion.div 
            key={cell.id}
            layout
            initial={false}
            animate={{ backgroundColor: getColor(cell.val) }}
            transition={{ duration: 0.5 }}
            className="w-full h-full rounded-sm relative group"
          >
            {/* Tooltip on hover */}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-elevated)] border border-[var(--signal)] font-mono text-[8px] text-[var(--signal)]">
              {cell.val > 0 ? '+' : ''}{cell.val.toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
