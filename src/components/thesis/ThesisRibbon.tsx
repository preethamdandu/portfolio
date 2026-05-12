"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useScroll, useTransform } from 'framer-motion';

const RibbonCanvas = dynamic(
  () => import('./ThesisRibbonCanvas').then((mod) => {
    const { Canvas } = require('@react-three/fiber');
    return function WrappedCanvas({ progress }: { progress: number }) {
      return (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ alpha: true }}>
          <mod.default progress={progress} />
        </Canvas>
      );
    }
  }),
  { ssr: false }
);

export default function ThesisRibbon() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  // Use framer-motion scroll to drive the uProgress uniform
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [pVal, setPVal] = useState(0);

  useEffect(() => {
    return progress.on('change', v => setPVal(v));
  }, [progress]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isWeakDevice = (navigator.hardwareConcurrency || 4) <= 4;
    const isMobile = window.innerWidth < 768;
    
    if (!prefersReducedMotion && !isWeakDevice && !isMobile) {
      setShouldLoad(true);
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50 mix-blend-multiply hidden md:block">
      {shouldLoad && <RibbonCanvas progress={pVal} />}
    </div>
  );
}
