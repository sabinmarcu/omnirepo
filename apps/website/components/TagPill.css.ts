import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';

export const tagPillStyle = style({
  display: 'inline-grid',
  gridAutoFlow: 'column',
  placeItems: 'center',
  gap: theme.grid.s,
  paddingInline: theme.grid.s,
  lineHeight: '1.5',
  borderInlineStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 40%, transparent)`,
  borderInlineEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 40%, transparent)`,
  borderBlockStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 40%, transparent)`,
  borderBlockEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 40%, transparent)`,
  borderRadius: '2px',
  color: 'inherit',
  background: `color-mix(in hsl, ${theme.colors.primary.muted} 20%, transparent)`,
  textDecoration: 'none',
});

export const tagPillCountStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.8em',
});
