import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

const outlineColor = `color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`;

export const codeContentStyle = style({
  position: 'relative',
});

export const codeOverlayRailStyle = style({
  position: 'absolute',
  insetBlockStart: theme.grid.m,
  insetInlineEnd: theme.grid.m,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.grid.xs,
  zIndex: 1,
});

export const codeOverlayItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  minInlineSize: '1.5rem',
  blockSize: '1.5rem',
  padding: 0,
  borderInlineStart: `1px solid ${outlineColor}`,
  borderInlineEnd: `1px solid ${outlineColor}`,
  borderBlockStart: `1px solid ${outlineColor}`,
  borderBlockEnd: `1px solid ${outlineColor}`,
  borderRadius: '2px',
  font: 'inherit',
  fontSize: '0.75rem',
  lineHeight: 1,
  paddingInline: theme.grid.xs,
});

export const codeLanguageStyle = style({
  background: 'transparent',
});
