import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerpPointer, type PointerRef } from '../usePointer';

export default function TorusKnot({ pointer }: { pointer: PointerRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const knot = knotRef.current;
    if (!group || !knot) return;
    const p = pointer.current;
    lerpPointer(p, delta);

    knot.rotation.y += 0.15 * delta;
    knot.rotation.x += 0.05 * delta;

    if (p.active) {
      const ease = 1 - Math.exp(-4 * delta);
      group.rotation.x += (-p.y * 0.3 - group.rotation.x) * ease;
      group.rotation.y += (p.x * 0.3 - group.rotation.y) * ease;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={knotRef}>
        <mesh>
          <torusKnotGeometry args={[1.1, 0.32, 220, 24]} />
          <meshBasicMaterial wireframe color="#22d3ee" transparent opacity={0.35} />
        </mesh>
        {/* inner solid knot occludes back-facing wireframe for a depth illusion */}
        <mesh scale={0.985}>
          <torusKnotGeometry args={[1.1, 0.32, 220, 24]} />
          <meshBasicMaterial color="#0a0a0f" />
        </mesh>
      </group>
    </group>
  );
}
