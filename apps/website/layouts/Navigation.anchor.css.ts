import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/website-theme';
import { navigationBlockOffset } from './Navigation.css';

const navigationAnchorOffset = `calc(${navigationBlockOffset} + ${theme.grid.m})`;

// Out of flow so it never becomes a flex/grid item.
export const navigationAnchorStyle = style({
  position: 'absolute',
  insetBlockStart: 0,
  scrollMarginBlockStart: navigationAnchorOffset,
});

globalStyle(`:has(> ${navigationAnchorStyle})`, {
  position: 'relative',
});

globalStyle(':is(h1, h2, h3, h4, h5, h6)[id]', {
  scrollMarginBlockStart: navigationAnchorOffset,
});
