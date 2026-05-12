"use client";

import { motion } from 'framer-motion';

interface DossierDotProps {
  onClick: () => void;
}

export default function DossierDot({ onClick }: DossierDotProps) {
  return (
    <motion.button
      className="inline-flex items-center cursor-pointer ml-4 align-baseline relative -bottom-[0.02em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded-full border border-[var(--hairline-bold)] hover:border-[var(--signal)]/40 bg-[var(--bg-void)]/50 hover:bg-[var(--signal)]/[0.06] px-3 py-1.5 transition-all duration-300 group"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="About Preetham Dandu"
      role="button"
      tabIndex={0}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span
        className="w-[6px] h-[6px] rounded-full bg-[var(--signal)] inline-block flex-shrink-0 animate-pulse-signal"
        style={{ boxShadow: '0 0 6px rgba(198, 255, 61, 0.4)' }}
      />
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-tertiary)] group-hover:text-[var(--signal)] transition-colors ml-2 select-none">
        About
      </span>
    </motion.button>
  );
}
