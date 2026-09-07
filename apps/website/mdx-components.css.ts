import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { gridLines } from './layouts/grid.lines';

const mdxTableBorder = `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 35%, transparent)`;

export const mdxImage = style({
  gridColumn: gridLines.content,
  blockSize: 'auto',
  inlineSize: 'auto',
  marginInline: 'auto',
  maxInlineSize: '100%',
  borderRadius: '2px',
});

export const mdxInlineCode = style({
  display: 'inline',
  overflowWrap: 'anywhere',
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
});

// Tables are wider than prose more often than not; scroll rather than squeeze the column.
export const mdxTableWrapper = style({
  gridColumn: gridLines.content,
  marginBlock: theme.grid.l,
  overflowInline: 'auto',
  overscrollBehaviorInline: 'contain',
});

export const mdxTable = style({
  inlineSize: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.95em',
});

globalStyle(`${mdxTable} :is(th, td)`, {
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  textAlign: 'start',
  verticalAlign: 'top',
  borderBlockEnd: mdxTableBorder,
});

globalStyle(`${mdxTable} :is(th, td):first-child`, {
  paddingInlineStart: 0,
});

globalStyle(`${mdxTable} :is(th, td):last-child`, {
  paddingInlineEnd: 0,
});

globalStyle(`${mdxTable} th`, {
  fontWeight: 600,
  color: theme.colors.primary.muted,
  whiteSpace: 'nowrap',
});

globalStyle(`${mdxTable} tbody tr:last-child :is(th, td)`, {
  borderBlockEnd: 'none',
});

