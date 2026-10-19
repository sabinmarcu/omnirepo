import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';

export const deckPrintRootStyle = style({
  padding: theme.grid.xl,
  '@media': {
    print: {
      display: 'block',
      padding: 0,
    },
  },
});

export const deckPrintInstructionsStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  marginBlock: theme.grid.xl,
  '@media': {
    print: {
      display: 'none',
    },
  },
});

export const deckPrintTitleStyle = style({
  color: theme.colors.primary.base,
  fontSize: 'clamp(2rem, 6vw, 4rem)',
  lineHeight: 1,
});

export const deckPrintSlidesStyle = style({
  display: 'grid',
  gap: theme.grid.xl,
  paddingBlockEnd: theme.grid.xl,
  '@media': {
    print: {
      display: 'block',
      paddingBlockEnd: 0,
    },
  },
});

export const deckPrintSlideStyle = style({
  position: 'relative',
  display: 'flow-root',
  aspectRatio: '16 / 9',
  overflow: 'auto',
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.surface,
  padding: `clamp(${theme.grid.l}, 4cqw, calc(${theme.grid.xl} * 2))`,
  '@media': {
    print: {
      aspectRatio: 'auto',
      blockSize: '9in',
      boxSizing: 'border-box',
      breakAfter: 'page',
      breakInside: 'avoid',
      boxShadow: 'none',
      inlineSize: '16in',
      margin: 0,
      maxInlineSize: 'none',
      overflow: 'visible',
      padding: '0.45in',
    },
  },
});

export const deckPrintCountStyle = style({
  color: theme.colors.background.text,
  fontSize: '0.8em',
  fontWeight: 700,
  letterSpacing: '0.08em',
  marginBlockEnd: theme.grid.s,
});

globalStyle(`${deckPrintSlideStyle} > h2`, {
  color: theme.colors.primary.base,
  fontSize: 'clamp(1.6rem, 3.8cqw, 3rem)',
  lineHeight: 1.1,
  marginBlockEnd: theme.grid.l,
});

globalStyle(`${deckPrintSlideStyle} :where(p, ul, ol, table, figure, pre)`, {
  marginBlock: theme.grid.m,
});

globalStyle(`${deckPrintSlideStyle} :where(ul, ol)`, {
  marginInlineStart: theme.grid.l,
});

globalStyle(`${deckPrintSlideStyle} :where(img, svg, video)`, {
  blockSize: 'auto',
  maxInlineSize: '100%',
});

globalStyle(`${deckPrintSlideStyle} :where(pre, table)`, {
  display: 'block',
  maxInlineSize: '100%',
  overflow: 'visible',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

globalStyle(`${deckPrintSlideStyle} [data-reveal-fragment]`, {
  opacity: 1,
  transform: 'none',
  visibility: 'visible',
});

globalStyle(`html:has(body:has(${deckPrintRootStyle}))`, {
  '@media': {
    print: {
      blockSize: 'auto',
      maxBlockSize: 'none',
      overflow: 'visible',
    },
  },
});

globalStyle(`body:has(${deckPrintRootStyle})`, {
  '@media': {
    print: {
      blockSize: 'auto',
      maxBlockSize: 'none',
      overflow: 'visible',
    },
  },
});

globalStyle(`body:has(${deckPrintRootStyle}) main`, {
  '@media': {
    print: {
      blockSize: 'auto',
      overflow: 'visible',
    },
  },
});

globalStyle(`body:has(${deckPrintRootStyle}) main > nav`, {
  '@media': {
    print: {
      display: 'none',
    },
  },
});

globalStyle(`${deckPrintSlideStyle}:last-child`, {
  '@media': {
    print: {
      breakAfter: 'auto',
    },
  },
});

globalStyle(`${deckPrintSlideStyle} :where(button, [data-slide-interactive])`, {
  '@media': {
    print: {
      display: 'none',
    },
  },
});

globalStyle(`${deckPrintSlideStyle} a`, {
  color: theme.colors.background.text,
});

globalStyle(`body:has(${deckPrintRootStyle}) > :not(main)`, {
  '@media': {
    print: { display: 'none' },
  },
});

globalStyle(`body:has(${deckPrintRootStyle})::after`, {
  '@media': {
    print: { display: 'none' },
  },
});

globalStyle(`${deckPrintSlideStyle} pre`, {
  background: 'var(--ch-16)',
  color: 'var(--ch-4)',
});
