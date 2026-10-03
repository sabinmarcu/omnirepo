import { style } from '@vanilla-extract/css';
import { theme } from '../config/themes.js';

export const demo = style({
  display: 'grid',
  gap: theme.grid.m,
  padding: theme.grid.m,
  color: theme.colors.background.text,
  background: theme.colors.background.page,
});

export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.grid.s,
  alignItems: 'center',
});

export const controlButton = style({
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderRadius: theme.grid.s,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  color: theme.colors.primary.contrast,
  background: theme.colors.primary.base,
  cursor: 'pointer',
});

export const consumerGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
  gap: theme.grid.m,
});

export const consumer = style({
  display: 'grid',
  gap: theme.grid.s,
  minBlockSize: '7rem',
  padding: theme.grid.l,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderRadius: theme.grid.s,
  background: theme.colors.background.surface,
});

export const primaryConsumer = style({
  color: theme.colors.primary.contrast,
  background: theme.colors.primary.base,
});

export const secondaryConsumer = style({
  color: theme.colors.secondary.contrast,
  background: theme.colors.secondary.base,
});

export const exportsPanel = style({
  margin: 0,
  padding: theme.grid.m,
  overflow: 'auto',
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderRadius: theme.grid.s,
  color: theme.colors.background.text,
  background: theme.colors.background.depressed,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.75rem',
  whiteSpace: 'pre-wrap',
});

export const inertManifests = style({
  display: 'none',
});
