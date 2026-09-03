import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';

export const relatedContentStyle = style({
  display: 'grid',
  gap: theme.grid.m,
});

export const relatedContentListStyle = style({
  display: 'grid',
  gap: theme.grid.s,
  padding: 0,
  listStyle: 'none',
});

export const relatedContentLinkStyle = style({
  display: 'grid',
  gap: theme.grid.xs,
  padding: theme.grid.s,
  borderInlineStart: `2px solid ${theme.colors.primary.muted}`,
  color: 'inherit',
  textDecoration: 'none',
});

export const relatedContentTypeStyle = style({
  color: theme.colors.primary.muted,
  fontSize: '0.8em',
  textTransform: 'capitalize',
});
