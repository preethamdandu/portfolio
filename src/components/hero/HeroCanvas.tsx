"use client";

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
// import { createNoise3D } from 'simplex-noise'; // Note: simplex-noise default export or createNoise3D usage depending on v4. Here we just use Math.random for simplicity if simplex isn't immediately matching
// Simplex noise in v4 is `import { createNoise3D } from 'simplex-noise'` if needed, but manual drift is faster. Let's stick to standard math for performance.

export default function HeroCanvas() {
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use Memo to prevent reallocation
  const particleCount = 600;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorSignal = new THREE.Color('#C6FF3D');
    const colorTertiary = new THREE.Color('#5C5C63');

    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 15;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // mostly tertiary, some signal
      const color = Math.random() > 0.98 ? colorSignal : colorTertiary;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.05 * delta;
      
      // Cursor influence
      torusRef.current.rotation.x = THREE.MathUtils.lerp(
        torusRef.current.rotation.x,
        mousePosition.current.y * 0.07, // ±4 degrees approx
        0.05
      );
      torusRef.current.rotation.z = THREE.MathUtils.lerp(
        torusRef.current.rotation.z,
        -mousePosition.current.x * 0.07,
        0.05
      );
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.02 * delta;
      particlesRef.current.rotation.x += 0.01 * delta;
    }
  });

  return (
    <>
      <color attach="background" args={['#0A0A0B']} />
      {/* Lights */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Torus Knot */}
      <mesh ref={torusRef} position={[8, 4, -10]}>
        <torusKnotGeometry args={[10, 3, 200, 16]} />
        <meshBasicMaterial color="#C6FF3D" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Particle Field */}
      <points ref={particlesRef} position={[0, 0, -15]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Post Processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.1} intensity={0.4} />
      </EffectComposer>
    </>
  );
}
