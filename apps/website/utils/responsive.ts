import { theme } from '@sabinmarcu/theme';
import type { StyleRule } from '@vanilla-extract/css';

const gtMedia = [
  [theme.breakpoint['gt-mobile'], '(orientation: portrait)'],
  [theme.breakpoint['gt-tablet'], '(orientation: landscape)'],
].map((it) => `(${it.join(' and ')})`).join(' or ');
const ltMedia = [
  [theme.breakpoint['lt-mobile'], '(orientation: portrait)'],
  [theme.breakpoint['lt-tablet'], '(orientation: landscape)'],
].map((it) => `(${it.join(' and ')})`).join(' or ');

export const mobileMedia = <T extends StyleRule>(styles: T, min = false) => ({
  '@container': {
    [min ? gtMedia : ltMedia]: styles,
  },
} as const);
