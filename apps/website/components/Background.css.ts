import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'absolute',
  zIndex: 0,
  inset: 0,
  inlineSize: '100cqw',
  blockSize: '100cqh',
  ':after': {
    content: '',
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    background: 'url("/noise.svg")',
    backgroundRepeat: 'repeat',
    backgroundSize: '300px 300px',
    mixBlendMode: 'multiply',
    opacity: 0.1,
    filter: 'contrast(200%) brightness(100%)',
  },
});

export const backgroundStyle = style({
  position: 'absolute',
  zIndex: 10,
  inset: 0,

  inlineSize: '100cqw',
  blockSize: '100cqh',

  color: theme.colors.primary.base,
  transition: 'all 0.5s ease-out',
  selectors: {
    ':has([data-theme-variant="dark"]) &': {
      opacity: 0.1,
    },
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      opacity: 0.1,
    },
  },
  opacity: 0.3,
});
