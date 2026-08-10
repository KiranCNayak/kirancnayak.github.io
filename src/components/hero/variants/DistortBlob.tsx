import { useRef, type ComponentRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { lerpPointer, type PointerRef } from '../usePointer';

type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>;

export default function DistortBlob({ pointer }: { pointer: PointerRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<DistortMaterial>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;
    const p = pointer.current;
    lerpPointer(p, delta);
    const t = state.clock.elapsedTime;
    const ease = 1 - Math.exp(-4 * delta);

    if (p.active) {
      const energy = Math.min(1, p.velocity * 40);
      material.distort += (0.25 + 0.3 * energy - material.distort) * ease;
      // `speed` is only a mount-time prop; extra agitation comes from advancing time directly
      material.time += delta * 2 * energy;
      group.rotation.x += (p.y * 0.3 - group.rotation.x) * ease;
      group.rotation.y += (p.x * 0.4 - group.rotation.y) * ease;
    } else {
      material.distort += (0.35 + 0.1 * Math.sin(t * 0.6) - material.distort) * ease;
      group.rotation.y += delta * 0.15;
      group.rotation.x += (Math.sin(t * 0.3) * 0.1 - group.rotation.x) * ease;
    }
  });

  return (
    <group ref={groupRef}>
      <Icosahedron args={[1.4, 48]}>
        <MeshDistortMaterial
          ref={materialRef}
          distort={0.3}
          speed={2}
          color="#1e293b"
          metalness={0.9}
          roughness={0.25}
          emissive="#22d3ee"
          emissiveIntensity={0.08}
        />
      </Icosahedron>
    </group>
  );
}
