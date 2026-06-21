import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const rootStyles = style({
  background: theme.colors.background.page,
  position: 'absolute',
  inset: 0,
  marginBlockStart: 'auto',
  marginBlockEnd: 'auto',
  marginInlineStart: 'auto',
  marginInlineEnd: 'auto',
  display: 'grid',
  placeItems: 'center',
});

const spacing = createVar();
export const wrapperStyles = style({
  background: theme.colors.background.surface,
  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',
  gap: spacing,
  display: 'flex',
  flexFlow: 'column nowrap',
  containerType: 'inline-size',
  inlineSize: 'clamp(500px, 75cqmin, 100cqw)',
  fontSize: theme.grid.l,
  vars: {
    [spacing]: theme.grid.m,
  },
  '@container': {
    [theme.breakpoint['lt-mobile']]: {
      inlineSize: '100cqw',
      blockSize: '100cqw',
    },
  },
});

export const sectionStyles = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(30cqw, 1fr))',
  gridTemplateRows: 'auto 1fr',
  gap: spacing,
  paddingBlock: spacing,
  paddingInline: spacing,
  selectors: {
    '&:not(:first-of-type)': {
      borderBlockStart: `solid 2px ${theme.colors.background.elevated}`,
    },
  },
});

globalStyle(`${sectionStyles} label`, {
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridTemplateColumns: 'subgrid',
  gridRow: 'auto / span 2',
});

globalStyle(`${sectionStyles} span`, {
  gridRow: '1',
  lineHeight: '1em',
});

globalStyle(`${sectionStyles} input`, {
  paddingInlineStart: spacing,
  gridRow: '2',
});

globalStyle(`${sectionStyles} h2`, {
  gridColumn: '1 / -1',
  fontSize: '1.5em',
});
