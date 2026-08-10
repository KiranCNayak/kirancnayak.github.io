import { lazy } from 'react';

export type VariantId = 'particles' | 'blob' | 'monogram' | 'torus';

export const HERO_VARIANTS = [
  {
    id: 'particles',
    label: 'Particles',
    Component: lazy(() => import('./variants/ParticleField')),
  },
  {
    id: 'blob',
    label: 'Blob',
    Component: lazy(() => import('./variants/DistortBlob')),
  },
  {
    id: 'monogram',
    label: 'Monogram',
    Component: lazy(() => import('./variants/Monogram3D')),
  },
  {
    id: 'torus',
    label: 'Torus',
    Component: lazy(() => import('./variants/TorusKnot')),
  },
] as const;

export const DEFAULT_VARIANT: VariantId = 'particles';

export function isVariantId(value: unknown): value is VariantId {
  return HERO_VARIANTS.some((v) => v.id === value);
}
