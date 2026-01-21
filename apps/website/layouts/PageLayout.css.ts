import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const pageLayoutStyles = style({
  maxInlineSize: '1000px',
  display: 'block',
  marginBlockStart: '0',
  marginBlockEnd: '0',
  marginInlineStart: 'auto',
  marginInlineEnd: 'auto',
  fontSize: '1.3rem',
  '@media': {
    [theme.breakpoint['lt-tablet']]: {
      paddingInline: theme.grid.m,
    },
  },
});

globalStyle(`${pageLayoutStyles} h1`, {
  fontSize: '3.5rem',
});
