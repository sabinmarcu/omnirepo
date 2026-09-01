import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

// Out of flow so it never becomes a flex/grid item; scroll-padding clears the navbar.
export const navigationAnchorStyle = style({
  position: 'absolute',
  insetBlockStart: 0,
});

globalStyle(`:has(> ${navigationAnchorStyle})`, {
  position: 'relative',
});
