import {
  createVar,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';

export const landingPageWrapper = style({
  inlineSize: '100cqw',
  blockSize: '100cqh',
  position: 'relative',
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  containerType: 'inline-size',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  paddingBlockStart: '5cqmin',
});

const mixPercent = createVar({
  syntax: '<percentage>',
  initialValue: '0%',
  inherits: true,
}, 'mix-percent');

const logoSize = createVar('logo-size');
export const landingPageLogo = style({
  inlineSize: logoSize,
  blockSize: logoSize,
  filter: `drop-shadow(0 0 10px hsl(from ${theme.colors.background.elevated} h s l / 0.5))`,
  position: 'relative',
  vars: {
    [mixPercent]: '60%',
    [logoSize]: 'clamp(100px, 25cqmax, 200px)',
  },
  selectors: {
    ':has([data-theme-variant="dark"]) &': {
      vars: {
        [mixPercent]: '80%',
      },
    },
    '&::after': {
      content: '',
      mask: 'url("/sm.svg") no-repeat center',
      maskSize: 'contain',
      position: 'absolute',
      inlineSize: '100%',
      blockSize: '100%',
      background: `color-mix(in oklch, ${theme.colors.background.text} ${mixPercent}, ${theme.colors.background.page})`,
    } as unknown as any,
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        [mixPercent]: '80%',
      },
    },
  },
});

const listSpacing = createVar('list-spacing');
export const landingPageList = style({
  maxInlineSize: '1200px',
  inlineSize: '100cqw',

  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',

  marginBlockStart: theme.grid.xxl,

  paddingBlockStart: listSpacing,
  paddingBlockEnd: listSpacing,
  paddingInlineStart: listSpacing,
  paddingInlineEnd: listSpacing,

  gap: listSpacing,

  vars: {
    [listSpacing]: theme.grid.xl,
  },
});
