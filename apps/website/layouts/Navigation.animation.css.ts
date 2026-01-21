import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  keyframes,
} from '@vanilla-extract/css';

export const navigationAnimationPercent = createVar();
export const navigationAnimationOffset = createVar();
export const navigationAnimation = keyframes({
  '0%': {
    vars: {
      [navigationAnimationPercent]: '0%',
      [navigationAnimationOffset]: '1',
    },
  },
  '0.1%, 100%': {
    vars: {
      [navigationAnimationPercent]: '100%',
      [navigationAnimationOffset]: '0',
    },
  },
});

export const blendAnimation = (
  color: string,
  percent = '0%',
  flip?: boolean,
) => {
  const flipFix = flip
    ? `calc(100% - ${navigationAnimationPercent})`
    : navigationAnimationPercent;
  const percentFix = `calc(${flipFix} + ${percent})`;
  return (
    `color-mix(in hsl, ${color} ${percentFix}, ${theme.colors.background.page})`
  );
};

export const blendSize = (
  margin: string,
) => (
  `calc(${margin} * ${navigationAnimationOffset})`
);
