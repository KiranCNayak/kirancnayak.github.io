import { motion } from 'motion/react';
import { HERO_VARIANTS, type VariantId } from './variants';

interface HeroToggleProps {
  value: VariantId;
  onChange: (id: VariantId) => void;
}

export function HeroToggle({ value, onChange }: HeroToggleProps) {
  return (
    <div
      className="glass flex items-center gap-1 rounded-full p-1"
      role="group"
      aria-label="Hero scene style"
    >
      {HERO_VARIANTS.map((v) => {
        const isActive = v.id === value;
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(v.id)}
            className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="hero-pill"
                className="absolute inset-0 rounded-full bg-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default HeroToggle;
