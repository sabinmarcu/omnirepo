import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';

export const deckReadHeaderStyle = style({
  display: 'grid',
  gap: theme.grid.m,
  marginBlockStart: theme.grid.xl,
  marginBlockEnd: theme.grid.s,
});

export const deckReadDatesStyle = style({
  color: theme.colors.background.text,
  marginBlock: 0,
  opacity: 0.7,
});

export const deckReadDescriptionStyle = style({
  maxInlineSize: '65ch',
  lineHeight: 1.55,
  marginBlockStart: 0,
  marginBlockEnd: theme.grid.m,
});

export const deckReadTagsStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.s,
});

export const deckReadMetaStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.875em',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

export const deckReadTitleStyle = style({
  color: theme.colors.primary.base,
  fontSize: 'clamp(2.2rem, 5vw, 4.8rem)',
  lineHeight: 0.98,
  maxInlineSize: '15ch',
});

export const deckReadModeLinksStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.m,
  marginBlockEnd: theme.grid.xl,
});

export const deckReadModeButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minBlockSize: theme.grid.xl,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  borderInlineStart: `1px solid ${theme.colors.primary.base}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.base}`,
  borderBlockStart: `1px solid ${theme.colors.primary.base}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.base}`,
  borderRadius: theme.grid.xs,
  background: theme.colors.background.surface,
  color: theme.colors.background.text,
  fontWeight: 700,
  textDecoration: 'none',
  ':hover': {
    background: theme.colors.background.elevated,
  },
  ':focus-visible': {
    outline: `2px solid ${theme.colors.primary.base}`,
    outlineOffset: '2px',
  },
});

export const deckReadSlidesStyle = style({
  display: 'grid',
  gap: theme.grid.xl,
});

export const deckReadSlideStyle = style({
  position: 'relative',
  overflow: 'hidden',
  borderInlineStart: `1px solid color-mix(in oklch, ${theme.colors.primary.muted} 44%, transparent)`,
  borderInlineEnd: `1px solid color-mix(in oklch, ${theme.colors.primary.muted} 44%, transparent)`,
  borderBlockStart: `1px solid color-mix(in oklch, ${theme.colors.primary.muted} 44%, transparent)`,
  borderBlockEnd: `1px solid color-mix(in oklch, ${theme.colors.primary.muted} 44%, transparent)`,
  borderRadius: '4px',
  background: theme.colors.background.surface,
  padding: `clamp(${theme.grid.l}, 5cqw, calc(${theme.grid.xl} * 2))`,
  scrollMarginBlockStart: `calc(${theme.grid.xl} * 4)`,
});

export const deckReadSlideNumberStyle = style({
  color: theme.colors.background.text,
  fontSize: '0.8em',
  fontWeight: 700,
  letterSpacing: '0.08em',
  marginBlockEnd: theme.grid.s,
});

globalStyle(`${deckReadSlideStyle} > h2`, {
  color: theme.colors.primary.base,
  fontSize: 'clamp(1.8rem, 4cqw, 3.25rem)',
  lineHeight: 1.1,
  marginBlockEnd: theme.grid.l,
});

globalStyle(`${deckReadSlideStyle} :where(p, ul, ol, table, figure, pre)`, {
  marginBlock: theme.grid.m,
});

globalStyle(`${deckReadSlideStyle} :where(ul, ol)`, {
  marginInlineStart: theme.grid.l,
});

globalStyle(`${deckReadSlideStyle} :where(img, svg, video)`, {
  blockSize: 'auto',
  maxInlineSize: '100%',
});

globalStyle(`${deckReadSlideStyle} pre`, {
  maxInlineSize: '100%',
  overflowInline: 'auto',
});

globalStyle(`${deckReadSlideStyle} table`, {
  display: 'block',
  maxInlineSize: '100%',
  overflowInline: 'auto',
});

globalStyle(`${deckReadSlideStyle} a`, {
  color: theme.colors.background.text,
  textUnderlineOffset: '0.14em',
});

globalStyle(`${deckReadSlideStyle} :where(h3, h4)`, {
  color: theme.colors.background.text,
});

globalStyle(`${deckReadHeaderStyle} p`, {
  maxInlineSize: '65ch',
  lineHeight: 1.55,
});

globalStyle(`${deckReadSlideStyle} [data-reveal-fragment]`, {
  opacity: 1,
  visibility: 'visible',
});

globalStyle(`${deckReadSlideStyle} pre`, {
  background: 'var(--ch-16)',
  color: 'var(--ch-4)',
});
