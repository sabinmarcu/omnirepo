import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';

export const resultStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  padding: theme.grid.m,
  borderInlineStart: `2px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.surface,
});

export const richResultStyle = style({
  display: 'grid',
  gap: theme.grid.s,
});

export const resultTitleStyle = style({
  color: 'inherit',
  textDecoration: 'none',
});

export const resultMetaStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.s,
  color: theme.colors.primary.muted,
  fontSize: '0.85em',
});
