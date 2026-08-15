"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { isMobile } from 'react-device-detect';

interface MoonWidgetProps {
  isVisible: boolean;
}

const GALAXY_COUNT = 10000;
const GALAXY_RADIUS = 30;

const Galaxy = () => {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(GALAXY_COUNT * 3);
    const col = new Float32Array(GALAXY_COUNT * 3);
    const siz = new Float32Array(GALAXY_COUNT);

    const red = new THREE.Color('#dc2626');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < GALAXY_COUNT; i++) {
      const r = GALAXY_RADIUS * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.random() * 2 * Math.PI;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Randomly assign red or white color
      const color = Math.random() > 0.8 ? red : white;
      color.toArray(col, i * 3);

      siz[i] = Math.random() * 0.2 + 0.05;
    }
    return [pos, col, siz];
  }, []);

  useCursor(true);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow automatic rotation
      meshRef.current.rotation.y += 0.0002;
      meshRef.current.rotation.x += 0.0001;

      // Parallax effect with mouse
      meshRef.current.position.x = mouse.x * 0.5;
      meshRef.current.position.y = -mouse.y * 0.5;

      // Animate sizes for pulsing glow
      const sizesArray = (meshRef.current.geometry.attributes.size as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < GALAXY_COUNT; i++) {
        sizesArray[i] = sizes[i] * (1.1 + Math.sin(state.clock.elapsedTime + i) * 0.1);
      }
      meshRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  const handleClick = (e: any) => {
    const clickedPosition = e.point;
    if (meshRef.current) {
      const positions = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const velocities = new Float32Array(GALAXY_COUNT * 3).fill(0);
      for (let i = 0; i < GALAXY_COUNT; i++) {
        const i3 = i * 3;
        const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const dist = particlePos.distanceTo(clickedPosition);
        if (dist < 5) { // Scatter effect for nearby particles
          const impulse = new THREE.Vector3().subVectors(particlePos, clickedPosition).normalize().multiplyScalar(0.5 / (dist + 0.1));
          velocities[i3] = impulse.x;
          velocities[i3 + 1] = impulse.y;
          velocities[i3 + 2] = impulse.z;
        }
      }
      // Apply the scatter
      for (let i = 0; i < GALAXY_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  };

  return (
    <points ref={meshRef} onClick={handleClick}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors={true}
        sizeAttenuation={true}
        transparent
        alphaMap={new THREE.TextureLoader().load('/assets/particle.png')}
      />
    </points>
  );
};

export function MoonWidget({ isVisible }: MoonWidgetProps) {
  if (isMobile) {
    return (
      <img
        src="/assets/galaxy-fallback.jpeg"
        alt="A dark and cinematic image of a starfield."
        className="w-full h-full object-cover rounded-lg"
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      <Galaxy />
    </Canvas>
  );
}
