import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { lerpPointer, type PointerRef } from '../usePointer';

const COUNT = 4000;
const REPULSION_RADIUS = 1.5;

// deterministic PRNG (mulberry32) keeps render pure and the layout stable across re-renders
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ParticleField({ pointer }: { pointer: PointerRef }) {
  const pointsRef = useRef<THREE.Points>(null);
  const viewport = useThree((s) => s.viewport);

  const { home, positions } = useMemo(() => {
    const random = mulberry32(1337);
    const home = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // rejection-free ellipsoid sampling: random direction * cbrt(r) for uniform density
      const u = random() * 2 - 1;
      const phi = random() * Math.PI * 2;
      const r = Math.cbrt(random());
      const s = Math.sqrt(1 - u * u);
      home[i * 3] = s * Math.cos(phi) * r * 4;
      home[i * 3 + 1] = u * r * 2;
      home[i * 3 + 2] = s * Math.sin(phi) * r * 1;
    }
    return { home, positions: home.slice() };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const p = pointer.current;
    lerpPointer(p, delta);
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const attr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const px = p.x * (viewport.width / 2);
    const py = p.y * (viewport.height / 2);
    const driftAmp = p.active ? 0.06 : 0.18;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const hx = home[ix]!;
      const hy = home[ix + 1]!;
      const hz = home[ix + 2]!;
      const dx = hx + Math.sin(hx * 1.3 + hy * 0.7 + t * 0.6) * driftAmp;
      const dy = hy + Math.cos(hy * 1.1 + hz * 0.9 + t * 0.5) * driftAmp;
      const dz = hz + Math.sin(hz * 1.7 + hx * 0.5 + t * 0.4) * driftAmp;

      let x = arr[ix]!;
      let y = arr[ix + 1]!;
      let z = arr[ix + 2]!;

      const k = 2 * dt;
      x += (dx - x) * k;
      y += (dy - y) * k;
      z += (dz - z) * k;

      if (p.active) {
        const rx = x - px;
        const ry = y - py;
        const distSq = rx * rx + ry * ry + z * z;
        if (distSq < REPULSION_RADIUS * REPULSION_RADIUS && distSq > 1e-6) {
          const dist = Math.sqrt(distSq);
          const force = Math.min(0.08, 0.03 / distSq) * (1 - dist / REPULSION_RADIUS);
          x += (rx / dist) * force;
          y += (ry / dist) * force;
          z += (z / dist) * force;
        }
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#22d3ee"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
