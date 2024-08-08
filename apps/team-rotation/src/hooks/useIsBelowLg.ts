import { useMatchMedia } from '@sabinmarcu/use-match-media';

export const useIsBelowLg = () => {
  const isBelowLg = useMatchMedia([
    'max-width',
    '1199.95px',
  ]);
  return isBelowLg;
};
