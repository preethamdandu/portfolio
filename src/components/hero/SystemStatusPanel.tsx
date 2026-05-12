"use client";

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SystemStatusPanelProps {
  className?: string;
  onOpenDossier?: () => void;
}

export default function SystemStatusPanel({ className, onOpenDossier }: SystemStatusPanelProps) {
  const [time, setTime] = useState('');
  const [metrics, setMetrics] = useState({ latency: 7.66, throughput: 19200 });
  const [cmdState, setCmdState] = useState<'idle' | 'typing' | 'granted'>('idle');
  const [typedCmd, setTypedCmd] = useState('');

  const COMMAND = 'access operator_file --clearance=public';

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

  const handleTrigger = useCallback(() => {
    if (cmdState !== 'idle') return;
    setCmdState('typing');

    // Auto-type the command
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTypedCmd(COMMAND.slice(0, i));
      if (i >= COMMAND.length) {
        clearInterval(typeInterval);
        // Brief pause then "granted"
        setTimeout(() => {
          setCmdState('granted');
          // Open dossier after showing granted
          setTimeout(() => {
            onOpenDossier?.();
            // Reset after a moment
            setTimeout(() => {
              setCmdState('idle');
              setTypedCmd('');
            }, 500);
          }, 600);
        }, 300);
      }
    }, 25);
  }, [cmdState, onOpenDossier, COMMAND]);

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
        <div className="flex" suppressHydrationWarning><span className="w-32">local_time</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--signal)] tabular-nums">{time || '14:32:07'}</span> <span className="text-[var(--ink-tertiary)] ml-4">← live</span></div>
        <div className="flex"><span className="w-32">status</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">open_to_work = true</span></div>
        <div className="flex" suppressHydrationWarning><span className="w-32">latency_p99</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)] tabular-nums">{metrics.latency.toFixed(2)} ms</span></div>
        <div className="flex" suppressHydrationWarning><span className="w-32">throughput</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)] tabular-nums">{metrics.throughput.toLocaleString('en-US')} rps</span></div>
        <div className="flex"><span className="w-32">models</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">4 in production</span></div>
        <div className="flex"><span className="w-32">papers</span><span className="text-[var(--ink-tertiary)] mr-2">→</span><span className="text-[var(--ink-primary)]">1 published</span></div>
      </div>

      {/* Terminal command trigger */}
      <div className="mt-6 pt-4 border-t border-[var(--hairline)]">
        <button
          onClick={handleTrigger}
          className="w-full text-left group cursor-pointer rounded px-3 py-2 -mx-3 -mb-1 hover:bg-[var(--signal)]/[0.05] transition-colors"
          aria-label="View operator dossier"
        >
          {cmdState === 'idle' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[var(--signal)] opacity-70">❯</span>
                <span className="text-[var(--ink-tertiary)] group-hover:text-[var(--ink-primary)] transition-colors">
                  operator_file
                </span>
                <span className="inline-block w-[6px] h-[14px] bg-[var(--signal)] animate-pulse ml-1" />
              </div>
              <span className="mono text-[9px] text-[var(--ink-tertiary)] opacity-40 group-hover:opacity-80 transition-opacity uppercase tracking-widest">
                click ↵
              </span>
            </div>
          )}

          {cmdState === 'typing' && (
            <div className="flex items-center gap-2">
              <span className="text-[var(--signal)] opacity-70">❯</span>
              <span className="text-[var(--ink-primary)]">{typedCmd}</span>
              <span className="inline-block w-[6px] h-[14px] bg-[var(--signal)] animate-pulse" />
            </div>
          )}

          {cmdState === 'granted' && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[var(--signal)] opacity-70">❯</span>
                <span className="text-[var(--ink-primary)]">{COMMAND}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--signal)]">
                <span>✓</span>
                <span className="text-xs uppercase tracking-widest">Clearance Granted · Loading Dossier...</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

