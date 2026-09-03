import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';

export const searchClientStyle = style({
  display: 'grid',
  gap: theme.grid.m,
});

export const searchControlsStyle = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: theme.grid.s,
});

export const searchInputStyle = style({
  minInlineSize: 0,
  padding: theme.grid.s,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.page,
  color: theme.colors.background.text,
  font: 'inherit',
});

export const searchSelectStyle = style({
  padding: theme.grid.s,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.page,
  color: theme.colors.background.text,
  font: 'inherit',
});

export const searchResultsStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  padding: 0,
  listStyle: 'none',
});

export const searchResultLinkStyle = style({
  display: 'grid',
  gap: theme.grid.xs,
  padding: theme.grid.s,
  borderInlineStart: `2px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.surface,
  color: 'inherit',
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      background: theme.colors.background.elevated,
    },
  },
});

export const searchResultTypeStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.8em',
});

export const searchStatusStyle = style({
  color: theme.colors.primary.muted,
});
