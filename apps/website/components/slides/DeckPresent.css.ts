import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';

export const deckPresentRootStyle = style({
  background: theme.colors.background.page,
  color: theme.colors.background.text,
  inlineSize: '100%',
  blockSize: '100%',
});

export const deckPresentSlidesStyle = style({
  blockSize: '100%',
});

export const deckPresentSlideStyle = style({
  boxSizing: 'border-box',
  color: theme.colors.background.text,
  textAlign: 'start',
});

export const deckPresentSlideCountStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.55em',
  fontWeight: 700,
  letterSpacing: '0.08em',
  marginBlockEnd: theme.grid.s,
});

export const deckPresentNotesStyle = style({
  display: 'none',
});

export const deckPresentBackLinkStyle = style({
  color: theme.colors.primary.base,
  background: theme.colors.background.page,
  insetBlockEnd: theme.grid.m,
  insetInlineStart: theme.grid.m,
  position: 'fixed',
  zIndex: 10,
});

globalStyle(`${deckPresentRootStyle}.reveal`, {
  fontSize: `calc(${theme.grid.l} * 1.2)`,
});

globalStyle(`${deckPresentRootStyle} .slides`, {
  textAlign: 'start',
});

globalStyle(`${deckPresentRootStyle} .slides section`, {
  background: theme.colors.background.surface,
  minBlockSize: '100%',
  borderInlineStart: `0.45rem solid ${theme.colors.primary.base}`,
  padding: `calc(${theme.grid.xl} * 2)`,
});

globalStyle(`${deckPresentRootStyle} .slides section > h1`, {
  color: theme.colors.primary.base,
  fontSize: '2.45em',
  lineHeight: 1.02,
  marginBlockEnd: '0.55em',
});

globalStyle(`${deckPresentRootStyle} .slides section :where(h2, h3, h4)`, {
  color: theme.colors.primary.base,
  marginBlock: '0.65em 0.4em',
});

globalStyle(`${deckPresentRootStyle} .slides section :where(p, ul, ol, figure, table, pre)`, {
  marginBlock: '0.55em',
});

globalStyle(`${deckPresentRootStyle} .slides section :where(ul, ol)`, {
  marginInlineStart: '1.25em',
});

globalStyle(`${deckPresentRootStyle} .slides section :where(img, svg, video)`, {
  blockSize: 'auto',
  maxBlockSize: '11em',
  maxInlineSize: '100%',
});

globalStyle(`${deckPresentRootStyle} .slides section :where(pre, table)`, {
  fontSize: '0.62em',
  maxInlineSize: '100%',
});

globalStyle(`${deckPresentRootStyle} .slides section pre`, {
  overflow: 'auto',
});

globalStyle(`${deckPresentRootStyle} .slides section table`, {
  display: 'block',
  overflow: 'auto',
});

globalStyle(`${deckPresentRootStyle} .controls`, {
  color: theme.colors.primary.base,
});

globalStyle(`${deckPresentRootStyle} .progress`, {
  color: theme.colors.primary.base,
});

globalStyle(`${deckPresentRootStyle} .speaker-controls-notes`, {
  color: theme.colors.background.text,
});

globalStyle(`${deckPresentRootStyle} .slides section .fragment`, {
  opacity: 0,
});

globalStyle(`${deckPresentRootStyle} .slides section .fragment.visible`, {
  opacity: 1,
});

export const deckPresentNoScriptStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  padding: theme.grid.l,
});

globalStyle(`${deckPresentRootStyle} .slides section a`, {
  color: theme.colors.background.text,
});

globalStyle(`${deckPresentRootStyle} .slides section pre`, {
  background: 'var(--ch-16)',
  color: 'var(--ch-4)',
});
