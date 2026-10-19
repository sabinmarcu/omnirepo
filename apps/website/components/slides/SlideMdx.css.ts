import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const columnsStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.grid.l,
  alignItems: 'center',
  '@media': {
    [theme.breakpoint.lt.mobile]: { gridTemplateColumns: '1fr' },
  },
});

export const exampleStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  minInlineSize: 0,
});

export const slideTabsStyle = style({
  display: 'grid',
  minInlineSize: 0,
  maxInlineSize: '100%',
});

globalStyle(`${slideTabsStyle} [role="tabpanel"]`, {
  minInlineSize: 0,
});

globalStyle(`${slideTabsStyle} pre`, {
  maxInlineSize: '100%',
  margin: 0,
  background: 'var(--ch-16)',
  color: 'var(--ch-4)',
  fontSize: '0.8em',
  lineHeight: 1.35,
});

export const imageStyle = style({
  display: 'block',
  inlineSize: 'auto',
  maxInlineSize: '100%',
  blockSize: 'auto',
  maxBlockSize: '12rem',
  marginInline: 'auto',
});

export const tableWrapperStyle = style({
  overflowInline: 'auto',
  maxInlineSize: '100%',
});
export const tableStyle = style({
  inlineSize: '100%',
  borderCollapse: 'collapse',
});
globalStyle(`${tableStyle} :is(th, td)`, {
  textAlign: 'start',
  paddingBlock: theme.grid.xs,
  paddingInline: theme.grid.s,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
});

export const diagramStyle = style({
  minInlineSize: 0,
  marginBlock: theme.grid.s,
});
globalStyle(`${diagramStyle} svg`, {
  display: 'block',
  inlineSize: '100%',
  blockSize: 'auto',
  maxBlockSize: '17rem',
});

export const swatchesStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: theme.grid.m,
});
export const swatchStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  overflowWrap: 'anywhere',
  fontSize: '0.8em',
});
export const swatchSampleStyle = style({
  display: 'block',
  blockSize: '4rem',
  borderRadius: theme.grid.xs,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
});

export const staticCounterStyle = style({
  display: 'grid',
  gap: theme.grid.m,
  padding: theme.grid.l,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderRadius: theme.grid.s,
  background: theme.colors.background.surface,
});
export const counterButtonStyle = style({
  justifySelf: 'start',
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  color: theme.colors.background.text,
  background: theme.colors.background.surface,
  borderInlineStart: `2px solid ${theme.colors.primary.base}`,
  borderInlineEnd: `2px solid ${theme.colors.primary.base}`,
  borderBlockStart: `2px solid ${theme.colors.primary.base}`,
  borderBlockEnd: `2px solid ${theme.colors.primary.base}`,
  borderRadius: theme.grid.xs,
  font: 'inherit',
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${theme.colors.primary.base}`,
    outlineOffset: '3px',
  },
});
