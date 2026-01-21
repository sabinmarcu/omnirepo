import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/website-theme';

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
  aspectRatio: '7/3',
  cursor: 'pointer',
  display: 'flex',
  flexFlow: 'column nowrap',

  background: `oklch(from ${color} l c h / ${colorIntensity})`,
  backdropFilter: 'blur(10px)',

  fontSize: '2.5rem',

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
    [borderSize]: '6px',
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

globalStyle(['a', 'a:visited', 'a:link'].map(
  (it) => `${it}:has(> ${wrapperStyle})`,
).join(', '), {
  textDecoration: 'none',
  color: 'inherit',
});

const wipMeshSize = createVar('wip-mesh-size');
const wipMeshColor = createVar('wip-mesh-color');
const wipMeshSteps = [
  'transparent 0%',
  `transparent calc(${wipMeshSize} / 4)`,
  `${wipMeshColor} calc(${wipMeshSize} / 4)`,
  `${wipMeshColor} ${wipMeshSize}`,
].join(', ');

export const wipStyle = style({
  cursor: 'not-allowed',
  position: 'relative',
  ':before': {
    content: '',
    position: 'absolute',
    zIndex: -2,
    inset: '0.8rem',
    backgroundImage: `repeating-linear-gradient(45deg, ${wipMeshSteps})`,
    backgroundAttachment: 'fixed',
    opacity: 0.2,
  },
  vars: {
    [wipMeshSize]: '50px',
    [wipMeshColor]: theme.colors.warning.base,
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        [wipMeshColor]: `hsla(from ${theme.colors.warning.base} h s l / 0.3)`,
      },
    },
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
  fontSize: '1.8rem',
  textTransform: 'uppercase',
  zIndex: '-0',
});