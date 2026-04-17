"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LineRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function LineReveal({ text, className = "", delay = 0 }: LineRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  // Simple split by newline. For robust line-wrapping, you'd calculate this on the fly,
  // but for the portfolio we use semantic breaks.
  const lines = text.split('\n');

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden block">
          <motion.div
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.8,
              ease: [0.2, 0.8, 0.2, 1],
              delay: delay + i * 0.08,
            }}
          >
            {line === "" ? "\u00A0" : line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
