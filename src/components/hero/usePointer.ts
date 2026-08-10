import { useEffect, useRef, type RefObject } from 'react';

export interface PointerState {
  x: number;
  y: number;
  tx: number;
  ty: number;
  velocity: number;
  active: boolean;
}

export type PointerRef = RefObject<PointerState>;

export function lerpPointer(p: PointerState, dt: number): void {
  // 1 - exp(-k*dt) gives framerate-independent exponential smoothing
  const t = 1 - Math.exp(-8 * dt);
  const px = p.x;
  const py = p.y;
  p.x += (p.tx - p.x) * t;
  p.y += (p.ty - p.y) * t;
  const dx = p.x - px;
  const dy = p.y - py;
  const v = Math.hypot(dx, dy);
  p.velocity += (v - p.velocity) * Math.min(1, 10 * dt);
}

export function usePointer(): PointerRef {
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    velocity: 0,
    active: false,
  });

  useEffect(() => {
    const p = pointerRef.current;
    if (window.matchMedia('(pointer: coarse)').matches) {
      p.active = false;
      return;
    }
    p.active = true;
    const onMove = (e: PointerEvent) => {
      p.tx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointerRef;
}
