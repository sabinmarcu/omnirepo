// #region ignore
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  keyframes,
  style,
} from '@vanilla-extract/css';

const background = createVar();
const text = createVar();

export const crtDpiRootStyles = style({
  display: 'grid',
  placeItems: 'center',
  inlineSize: '100cqw',
  blockSize: '100cqh',
  overflow: 'hidden',
  containerType: 'inline-size',
  background: 'black',
  fontFamily: 'monospace',

  vars: {
    [background]: '#0c1e03',
    [text]: '#537600',
  },
});

// eslint-disable-next-line logical-properties/border
export const crtDpiScreenStyles = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  inlineSize: '70cqw',
  blockSize: '70cqh',
  fontSize: '2rem',
  background,
  color: text,
  textShadow: `0px 0px 10px ${text}`,
  containerType: 'inline-size',
  transform: 'translate3d(0px, 0px, 0px)',
  borderRadius: '10px',
  border: `solid 1px hsla(from ${text} h s l / 0.5)`,
  boxShadow: `-1px 4px 20px 20px hsla(from ${text} h s l / 0.2)`,
  overflow: 'hidden',

  selectors: {
    '&:after, &::before': {
      content: '',
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle, white 0%, white 65%, hsla(from black h s l / 0.2) 100%)',
      pointerEvents: 'none',
    },

    '&:before': {
      mixBlendMode: 'multiply',
    },

    '&:after': {
      mixBlendMode: 'overlay',
    },
  },
});

export const crtDpiScrollContainerStyles = style({
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  position: 'relative',
  scrollbarColor: `${text} ${background}`,
  scrollbarWidth: 'thin',
  containerType: 'inline-size',
});

const crtFlickerAnimation = keyframes({
  '0%': {
    opacity: 0.01,
  },
  '50%': {
    opacity: 0,
  },
});
// #endregion ignore

// #region DPI-Locked Scanlines
const devicePixelRatio = 'var(--dpr, 1)';
const snapToDevicePixels = (cssPixels: string) => [
  `calc(round(${cssPixels} * ${devicePixelRatio}, 1)`,
  `* 1px / ${devicePixelRatio})`,
].join(' ');

const scanLinePeriod = snapToDevicePixels('4');

const scanLineOverlayStyles = {
  position: 'fixed',
  background: `repeating-linear-gradient(0deg, black, white ${scanLinePeriod})`,
  mixBlendMode: 'overlay',
} as const;
// #endregion DPI-Locked Scanlines

// #region ignore

export const crtDpiContentContainerStyles = style({
  position: 'relative',
  padding: '2.5rem',
  boxSizing: 'border-box',
  overflow: 'hidden',

  selectors: {
    '&:before, &:after': {
      content: '',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
    },

    '&:before': {
      animationName: crtFlickerAnimation,
      animationDuration: '50ms',
      animationIterationCount: 'infinite',
      background: 'hsla(from white h s l / 0.005)',
    },

    '&:after': scanLineOverlayStyles,
  },
});

globalStyle(`${crtDpiContentContainerStyles} p`, {
  marginBlock: theme.grid.xl,
});
globalStyle(`${crtDpiContentContainerStyles} p:first-of-type`, {
  marginBlockStart: 0,
});
globalStyle(`${crtDpiContentContainerStyles} p:last-of-type`, {
  marginBlockEnd: 0,
});
// #endregion ignore
