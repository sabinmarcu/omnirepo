import { theme } from '@sabinmarcu/theme';
import type { StyleRule } from '@vanilla-extract/css';

export const mobileMedia = <T extends StyleRule>(styles: T, min = false) => ({
  '@container': {
    [min ? theme.breakpoint['gt-mobile'] : theme.breakpoint['lt-mobile']]: styles,
  },
} as const);
