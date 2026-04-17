"use client";

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DigitFlicker({ value, className }: { value: string | number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const targetValue = String(value);
  const [displayValue, setDisplayValue] = useState<string>(
    targetValue.replace(/[0-9]/g, '0') // Start with all zeros
  );

  useEffect(() => {
    if (!isInView) return;

    const chars = "0123456789";
    const iterations = targetValue.length * 3; // roughly 3 scrambles per character left to right
    let currentIteration = 0;

    const interval = setInterval(() => {
      setDisplayValue(prev => {
        return targetValue.split('').map((char, idx) => {
          // If it's a non-number (like comma, period, %, κ), keep it as is
          if (!/[0-9]/.test(char)) return char;

          // If we passed the iteration threshold for this character position, snap to final
          if (idx < currentIteration / 3) {
            return char;
          }

          // Otherwise, scramble
          return chars[Math.floor(Math.random() * 10)];
        }).join('');
      });

      if (currentIteration >= iterations) {
        clearInterval(interval);
      }
      currentIteration += 1;
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, targetValue]);

  return (
    <div ref={ref} className={cn("inline-block numeric relative", className)}>
      {/* We apply a flicker effect class to the outer container when animating */}
      <span className={displayValue !== targetValue ? "flicker" : ""}>
        {displayValue}
      </span>
    </div>
  );
}
