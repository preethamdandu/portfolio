"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float uProgress;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Create a paper-like folding/unfolding effect based on uProgress
  // uProgress goes 0 -> 1
  
  float wave = sin(pos.x * 0.5 + uProgress * 5.0) * 0.5;
  
  // Fold start (0) is crumpled, Fold end (1) is flat
  float crumple = sin(pos.x * 2.0) * cos(pos.y * 3.0) * (1.0 - uProgress);
  pos.z += crumple * 2.0;
  
  // Sweep across the screen
  pos.x += (1.0 - uProgress) * 20.0;
  pos.y += wave * (1.0 - uProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uEdgeColor;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  // Highlight the edges
  float edgeX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  float edgeY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
  float edge = 1.0 - (edgeX * edgeY);

  vec3 finalColor = mix(uColor, uEdgeColor, edge * 0.5);
  
  gl_FragColor = vec4(finalColor, uOpacity + (edge * 0.2));
}
`;

export default function ThesisRibbonCanvas({ progress }: { progress: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color('#5C5C63') },
    uEdgeColor: { value: new THREE.Color('#C6FF3D') },
    uOpacity: { value: 0.2 }
  }), []);

  useFrame(() => {
    if (materialRef.current) {
      // Lerp the progress for smoothness
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uProgress.value,
        progress,
        0.1
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh rotation={[-0.5, 0.2, 0.1]} scale={1.2}>
        {/* Flat wide strip to mimic a paper ribbon */}
        <planeGeometry args={[30, 8, 128, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
