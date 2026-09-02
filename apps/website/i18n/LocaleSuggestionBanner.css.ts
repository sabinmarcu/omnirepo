import { style } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/website-theme';

export const localeSuggestionBannerStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.grid.s,
  marginBlockEnd: theme.grid.m,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  borderInlineStart: `2px solid ${theme.colors.primary.base}`,
  background: theme.colors.background.elevated,
  color: theme.colors.background.text,
});

export const localeSuggestionBannerActionStyle = style({
  paddingBlock: theme.grid.xs,
  paddingInline: theme.grid.s,
  borderInlineStart: `1px solid ${theme.colors.primary.base}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.base}`,
  borderBlockStart: `1px solid ${theme.colors.primary.base}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.base}`,
  background: theme.colors.background.page,
  color: theme.colors.background.text,
  cursor: 'pointer',
  font: 'inherit',
});
