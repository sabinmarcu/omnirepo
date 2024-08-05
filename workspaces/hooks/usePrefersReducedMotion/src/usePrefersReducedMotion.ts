import { useMatchMedia } from '@sabinmarcu/use-match-media';

export const usePrefersReducedMotion = () => useMatchMedia(
  [
    'prefers-reduced-motion',
    'reduce',
  ],
);
