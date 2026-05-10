"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Generate random points in a spherical shell
const generateParticles = (count: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 10 + Math.random() * 20; // Spread between 10 and 30
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

const ParticleSystem = () => {
  const ref = useRef<THREE.Points>(null);
  const ref2 = useRef<THREE.Points>(null);
  
  const positionsRed = useMemo(() => generateParticles(1500), []);
  const positionsWhite = useMemo(() => generateParticles(500), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
    if (ref2.current) {
      ref2.current.rotation.x += delta / 20;
      ref2.current.rotation.y += delta / 25;
    }
  });

  return (
    <group>
      {/* Red Particles */}
      <Points ref={ref} positions={positionsRed} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#EE1C25" // RCB Red
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* White/Bright Particles */}
      <Points ref={ref2} positions={positionsWhite} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Animated pulsing background sphere
const CoreGlow = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshBasicMaterial 
        color="#EE1C25" 
        transparent 
        opacity={0.03} 
        blending={THREE.AdditiveBlending} 
      />
    </mesh>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#020202]">
      {/* Fallback gradient if WebGL fails */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rcb-red/5 via-black to-black opacity-80" />
      
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#020202", 10, 35]} />
        <CoreGlow />
        <ParticleSystem />
      </Canvas>
    </div>
  );
};
