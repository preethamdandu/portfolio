"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SystemStatusPanel({ className }: { className?: string }) {
  const [time, setTime] = useState('');
  const [metrics, setMetrics] = useState({ latency: 7.66, throughput: 19200 });

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    updateTime();
    
    const timeIntval = setInterval(updateTime, 1000);
    
    const metricsIntval = setInterval(() => {
      setMetrics(prev => ({
        latency: 7.66 * (1 + (Math.random() - 0.5) * 0.06),
        throughput: Math.floor(19200 * (1 + (Math.random() - 0.5) * 0.06))
      }));
    }, 4000);

    return () => {
      clearInterval(timeIntval);
      clearInterval(metricsIntval);
    };
  }, []);

  return (
    <div className={cn("border border-[var(--hairline)] bg-[var(--bg-sunken)] p-6 font-mono text-[13px] leading-relaxed text-[var(--ink-secondary)] w-full max-w-sm", className)}>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--hairline)]">
        <div className="flex items-center gap-4 text-[var(--ink-primary)] w-full relative">
          <span>SYSTEM</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--warn)]">
          <div className="w-2 h-2 rounded-full bg-[var(--warn)] animate-pulse-signal"></div>
          <span>LIVE</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex"><span className="w-32">role</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">multi-disciplinary</span></div>
        <div className="flex"><span className="w-32">focus</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">backend · ai · ml</span></div>
        <div className="flex"><span className="w-32">location</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">stony brook, ny</span></div>
        <div className="flex"><span className="w-32">timezone</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">america/new_york</span></div>
        <div className="flex"><span className="w-32">local_time</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--signal)] tabular-nums">{time || '14:32:07'}</span> <span className="text-[var(--ink-tertiary)] ml-4">← live</span></div>
        <div className="flex"><span className="w-32">status</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">open_to_work = true</span></div>
        <div className="flex"><span className="w-32">latency_p99</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)] tabular-nums">{metrics.latency.toFixed(2)} ms</span></div>
        <div className="flex"><span className="w-32">throughput</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)] tabular-nums">{metrics.throughput.toLocaleString('en-US')} rps</span></div>
        <div className="flex"><span className="w-32">models</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">4 in production</span></div>
        <div className="flex"><span className="w-32">papers</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">1 published</span></div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--hairline)]">
      </div>
    </div>
  );
}
