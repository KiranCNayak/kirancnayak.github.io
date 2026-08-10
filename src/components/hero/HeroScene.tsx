import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'motion/react';
import { usePointer } from './usePointer';
import { DEFAULT_VARIANT, HERO_VARIANTS, isVariantId, type VariantId } from './variants';
import { HeroToggle } from './HeroToggle';

const STORAGE_KEY = 'hero-variant';

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
  const [variant, setVariant] = useState<VariantId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isVariantId(stored) ? stored : DEFAULT_VARIANT;
  });
  const [visible, setVisible] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointer = usePointer();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const handleChange = (id: VariantId) => {
    setVariant(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  if (reducedMotion) return <StaticFallback />;

  const active = HERO_VARIANTS.find((v) => v.id === variant) ?? HERO_VARIANTS[0];
  const ActiveComponent = active.Component;

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <motion.div
        key={variant}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 6], fov: 45 }}
          frameloop={visible ? 'always' : 'never'}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 6]} intensity={30} color="#22d3ee" />
          <Suspense fallback={null}>
            <ActiveComponent pointer={pointer} />
          </Suspense>
        </Canvas>
      </motion.div>
      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        style={{ pointerEvents: 'auto' }}
      >
        <HeroToggle value={variant} onChange={handleChange} />
      </div>
    </div>
  );
}

export default HeroScene;
