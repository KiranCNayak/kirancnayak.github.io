import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, Text } from '@react-three/drei';
import * as THREE from 'three';
import { lerpPointer, type PointerRef } from '../usePointer';

export default function Monogram3D({ pointer }: { pointer: PointerRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p = pointer.current;
    lerpPointer(p, delta);
    const ease = 1 - Math.exp(-4 * delta);

    if (p.active) {
      group.rotation.x += (-p.y * 0.25 - group.rotation.x) * ease;
      group.rotation.y += (p.x * 0.25 - group.rotation.y) * ease;
    } else {
      const t = state.clock.elapsedTime;
      group.rotation.y += (Math.sin(t * 0.4) * 0.15 - group.rotation.y) * ease;
      group.rotation.x += (Math.cos(t * 0.3) * 0.08 - group.rotation.x) * ease;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.4}>
          <Text
            font="/fonts/space-grotesk-700.woff"
            fontSize={2.2}
            letterSpacing={-0.05}
            anchorX="center"
            anchorY="middle"
          >
            KN
            <meshPhysicalMaterial
              metalness={1}
              roughness={0.15}
              iridescence={1}
              iridescenceIOR={1.6}
              color="#94a3b8"
            />
          </Text>
        </Float>
      </group>
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#22d3ee"
          position={[0, 4, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 1.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#a78bfa"
          position={[-4, -2, 1]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[6, 1.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffffff"
          position={[4, 0, 1]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[6, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color="#22d3ee"
          position={[0, -4, -2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 1.5, 1]}
        />
      </Environment>
    </>
  );
}
