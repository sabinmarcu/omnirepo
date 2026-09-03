import { theme } from '@sabinmarcu/theme';
import { globalStyle } from '@vanilla-extract/css';
import { monoLisaCode } from '@/fonts/MonoLisaCode.css';
import { monoLisaText } from '@/fonts/MonoLisaText.css';
import './codehike.css';

globalStyle('html, body', {
  maxInlineSize: '100vw',
  maxBlockSize: '100vh',
  overflow: 'hidden',
});

globalStyle('body', {
  color: theme.colors.background.text,
  background: theme.colors.background.page,
  fontFamily: `${monoLisaText}, sans-serif`,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  containerName: 'body-container',
  containerType: 'size',
  inlineSize: '100cqw',
  blockSize: '100cqh',
});

globalStyle('code, kbd, pre, samp', {
  fontFamily: `${monoLisaCode}, monospace`,
  fontVariantLigatures: 'common-ligatures discretionary-ligatures',
});

globalStyle(':not(pre) > code', {
  display: 'inline-block',
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',
  background: `color-mix(in oklch, ${theme.colors.background.surface} 70%, transparent)`,
  fontSize: '1em',
  lineHeight: 'inherit',
  paddingInline: theme.grid.xxs,
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
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none !important',
      animation: 'none !important',
    },
  },
});

globalStyle('*', {
  scrollbarColor: `${theme.colors.background.elevated} ${theme.colors.background.depressed}`,
  scrollbarWidth: 'thin',
});
