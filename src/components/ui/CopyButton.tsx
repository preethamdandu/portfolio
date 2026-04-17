"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label, className }: { text: string, label?: string, className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={cn("group flex items-center gap-3 text-[var(--ink-primary)] hover:text-[var(--signal)] transition-colors mono", className)}
      data-magnetic
    >
      <span>{label || text}</span>
      <span className="opacity-40 group-hover:opacity-100 transition-opacity">
        {copied ? <Check size={14} className="text-[var(--signal)]" /> : <Copy size={14} />}
      </span>
      {/* Lime flash effect on click */}
      {copied && (
        <span className="absolute inset-0 bg-[var(--signal-glow)] rounded mix-blend-screen animate-pulse-signal pointer-events-none" />
      )}
    </button>
  );
}
