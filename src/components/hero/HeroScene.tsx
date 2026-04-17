"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroFallbackSVG from './HeroFallbackSVG';

// Dynamically import the heavy Canvas component (no SSR)
const SceneCanvas = dynamic(
  () => import('./HeroCanvas').then((mod) => {
    // Only return the Canvas wrapper when the internal module is ready
    const { Canvas } = require('@react-three/fiber');
    return function WrappedCanvas() {
      return (
        <Canvas camera={{ position: [0, 0, 20], fov: 45 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
          <mod.default />
        </Canvas>
      );
    }
  }),
  { ssr: false, loading: () => <HeroFallbackSVG /> }
);

export default function HeroScene() {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    // Determine if device can handle 3D reasonably well
    const checkCapabilities = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // On mobile or very weak devices, fall back to SVG
      const isWeakDevice = (navigator.hardwareConcurrency || 4) <= 4;
      const isSmallScreen = window.innerWidth < 768;

      if (!prefersReducedMotion && !isWeakDevice && !isSmallScreen) {
        setShouldLoad3D(true);
      }
    };
    
    checkCapabilities();
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none fade-in">
      {/* Radial mask to clip the torus knot to the top right and soften edges */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 100% 0%, transparent 20%, var(--bg-void) 70%)'
        }}
      />
      {shouldLoad3D ? <SceneCanvas /> : <HeroFallbackSVG />}
    </div>
  );
}
