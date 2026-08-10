import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { usePointer } from './usePointer';
import ParticleField from './ParticleField';

function StaticFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
      <div
        className="absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute top-2/3 left-1/3 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}

export function HeroScene() {
  // client:only island — window is always available, so lazy initializers are safe
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [visible, setVisible] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointer = usePointer();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      {
        threshold: 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) return <StaticFallback />;

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 6], fov: 45 }}
          frameloop={visible ? 'always' : 'never'}
        >
          <Suspense fallback={null}>
            <ParticleField pointer={pointer} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default HeroScene;
