import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';

export const tagPillStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.grid.s,
  paddingBlock: theme.grid.xs,
  paddingInline: theme.grid.s,
  borderInlineStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderInlineEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderRadius: '999px',
  color: 'inherit',
  background: `color-mix(in hsl, ${theme.colors.primary.muted} 15%, transparent)`,
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      background: `color-mix(in hsl, ${theme.colors.primary.muted} 30%, transparent)`,
    },
  },
});

export const tagPillCountStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.8em',
});
