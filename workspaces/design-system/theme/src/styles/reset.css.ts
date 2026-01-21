import { globalStyle } from '@vanilla-extract/css';
import { resetLayer } from './layers.js';

globalStyle(`:is(${[
  '*',
  '*::before',
  '*::after',
].join(', ')})`, {
  '@layer': {
    [resetLayer]: {
      boxSizing: 'border-box',
    },
  },
});

globalStyle('*', {
  '@layer': {
    [resetLayer]: {
      marginBlockStart: 0,
      marginBlockEnd: 0,
      marginInlineStart: 0,
      marginInlineEnd: 0,
      '@media': {
        '(prefers-reduced-motion: reduce)': {
          transform: 'none !important',
          animation: 'none !important',
        },
      },
    },
  },
});

globalStyle('html', {
  '@layer': {
    [resetLayer]: {
      '@media': {
        '(prefers-reduced-motion: no-preference)': {
          interpolateSize: 'allow-keywords',
        } as any,
      },
    },
  },
});

globalStyle('body', {
  '@layer': {
    [resetLayer]: {
      lineHeight: 1.5,
      WebkitFontSmoothing: 'antialiased',
    },
  },
});

globalStyle(`:is(${[
  'img',
  'picture',
  'video',
  'canvas',
  'svg',
].join(', ')})`, {
  '@layer': {
    [resetLayer]: {
      display: 'block',
      maxInlineSize: '100%',
    },
  },
});

globalStyle(`:is(${[
  'input',
  'button',
  'textarea',
  'select',
].join(', ')})`, {
  '@layer': {
    [resetLayer]: {
      font: 'inherit',
    },
  },
});

globalStyle(`:is(${[
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
].join(', ')})`, {
  '@layer': {
    [resetLayer]: {
      overflowWrap: 'break-word',

      paddingBlockStart: 0,
      paddingBlockEnd: 0,
      paddingInlineStart: 0,
      paddingInlineEnd: 0,

      marginBlockStart: 0,
      marginBlockEnd: 0,
      marginInlineStart: 0,
      marginInlineEnd: 0,

      fontSize: 'inherit',
    },
  },
});

globalStyle(':is(p)', {
  '@layer': {
    [resetLayer]: {
      textWrap: 'pretty',
    },
  },
});

globalStyle(`:is(${[
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
].join(', ')})`, {
  '@layer': {
    [resetLayer]: {
      textWrap: 'balance',
    },
  },
});
