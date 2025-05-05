import {
  createVar,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';

const spacing = createVar('spacing');
const color = createVar('color');
const colorIntensity = createVar({
  syntax: '<number>',
  inherits: true,
  initialValue: '0.1',
}, 'color-intensity');
const borderSize = createVar('border-size');
const boxShadowIntensity = createVar({
  syntax: '<number>',
  inherits: true,
  initialValue: '0.2',
}, 'shadow-intensity');
const boxShadow = `0 0px 20px oklch(from ${color} l c h / ${boxShadowIntensity})`;
export const wrapperStyle = style({
  cursor: 'pointer',
  display: 'flex',
  flexFlow: 'column nowrap',

  minBlockSize: '10rem',

  background: `oklch(from ${color} l c h / ${colorIntensity})`,
  backdropFilter: 'blur(10px)',

  borderInlineStart: `solid ${borderSize} ${color}`,
  borderInlineEnd: `solid ${borderSize} ${color}`,
  borderBlockStart: `solid ${borderSize} ${color}`,
  borderBlockEnd: `solid ${borderSize} ${color}`,

  boxShadow,

  ':hover': {
    vars: {
      [boxShadowIntensity]: '1',
      [color]: `color-mix(in oklch, ${theme.colors.primary.base} 30%, ${theme.colors.background.page})`,
      [colorIntensity]: '0',
    },
  },

  vars: {
    [spacing]: theme.grid.m,
    [color]: `color-mix(in oklch, ${theme.colors.primary.muted} 30%, ${theme.colors.background.page})`,
    [borderSize]: '2px',
    [boxShadowIntensity]: '0.3',
    [colorIntensity]: '0.1',
  },

  paddingBlockStart: spacing,
  paddingBlockEnd: spacing,
  paddingInlineStart: spacing,
  paddingInlineEnd: spacing,

  gap: spacing,

  borderStartStartRadius: theme.grid.xxs,
  borderStartEndRadius: theme.grid.xxs,
  borderEndEndRadius: theme.grid.xxs,
  borderEndStartRadius: theme.grid.xxs,

  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
});

const wipMeshSize = createVar('wip-mesh-size');
const wipMeshPercent = createVar('wip-mesh-percent');
const wipMeshSteps = [
  'transparent 0%',
  `transparent calc(50% - ${wipMeshPercent} / 2)`,
  `${theme.colors.background.surface} calc(50% - ${wipMeshPercent} / 2)`,
  `${theme.colors.background.surface} calc(50% + ${wipMeshPercent} / 2)`,
  'transparent 45%',
].join(', ');

export const wipStyle = style({
  cursor: 'not-allowed',
  position: 'relative',
  ':before': {
    content: '',
    position: 'absolute',
    zIndex: -2,
    inset: 0,
    backgroundImage: [
      `linear-gradient(45deg, ${wipMeshSteps})`,
      `linear-gradient(-45deg, ${wipMeshSteps})`,
    ].join(', '),
    backgroundSize: `${wipMeshSize} ${wipMeshSize}`,
    boxShadow: [
      boxShadow,
      `inset 0 0 10px ${theme.colors.background.page}`,
    ].join(', '),
    vars: {
      [wipMeshPercent]: '10%',
      [wipMeshSize]: '13px',
    },
    opacity: 0.3,
  },
  selectors: {
    '&:hover::before': {
      opacity: 0.5,
    },
  },
});

export const wipTip = style({
  position: 'absolute',
  insetInline: 0,
  insetBlockStart: spacing,
  textAlign: 'center',
  opacity: '0.2',
  userSelect: 'none',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  zIndex: '-0',
});
