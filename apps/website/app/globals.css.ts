import { theme } from '@sabinmarcu/theme';
import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  maxInlineSize: '100vw',
  overflowInline: 'hidden',
});

globalStyle('body', {
  color: theme.colors.background.text,
  background: theme.colors.background.page,
  fontFamily: 'Arial, Helvetica, sans-serif',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('*', {
  boxSizing: 'border-box',

  paddingBlockStart: 0,
  paddingBlockEnd: 0,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,

  marginBlockStart: 0,
  marginBlockEnd: 0,
  marginInlineStart: 0,
  marginInlineEnd: 0,
});

globalStyle('*, *::before, *::after', {
  transition: 'all 0.3s ease-out',
});