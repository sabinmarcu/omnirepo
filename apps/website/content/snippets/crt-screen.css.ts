/* eslint-disable max-len */
// #region ignore
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  keyframes,
  style,
} from '@vanilla-extract/css';
// #endregion ignore

// #region Root
/**
 * Setting up the background and colors for later down the line.
 */
const background = createVar();
const text = createVar();

export const crtRootStyles = style({
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
// #endregion Root

// #region Screen
/**
 * Styling the "screen" itself.
 * At the same time, we'll be simulating a CRT screen distortion, the way the screen is not flat, but somewhat concave by using two radial gradients, set to overlay and multiply.
 */
// eslint-disable-next-line logical-properties/border-radius, logical-properties/border
export const crtScreenStyles = style({
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

      background: `radial-gradient(${[
        'circle',
        'white 0%',
        'white 65%',
        'hsla(from black h s l / 0.2) 100%',
      ].join(', ')})`,

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
// #endregion Screen

// #region Scroll
/**
 * Setting up scrolling within the container
 */
export const crtScrollContainerStyles = style({
  overflowInline: 'hidden',
  overflowBlock: 'auto',

  position: 'relative',

  scrollbarColor: `${text} ${background}`,
  scrollbarWidth: 'thin',

  containerType: 'inline-size',
});
// #endregion Scroll

// #region Content
/**
 * Here we will be setting up the CRT scanlines and a slight flicker animation.
 * Technically the scanlines and flicker should apply to the whole screen, but for now we want the lines to scroll with the content.
 */
const crtFlickerAnimation = keyframes({
  '0%': {
    opacity: 0.01,
  },
  '50%': {
    opacity: 0,
  },
});

// eslint-disable-next-line logical-properties/padding
export const crtContentContainerStyles = style({
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

    '&:after': {
      background: 'repeating-linear-gradient(0deg, black, white 4px)',
      mixBlendMode: 'overlay',
    },
  },
});
// #endregion Content

// #region ignore
globalStyle(`${crtContentContainerStyles} p`, {
  marginBlock: theme.grid.xl,
});
globalStyle(`${crtContentContainerStyles} p:first-of-type`, {
  marginBlockStart: 0,
});
globalStyle(`${crtContentContainerStyles} p:last-of-type`, {
  marginBlockEnd: 0,
});
// #endregion ignore