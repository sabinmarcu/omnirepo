import { style } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/website-theme';

export const translationFallbackNoticeStyle = style({
  marginBlockEnd: theme.grid.m,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
  borderInlineStart: `2px solid ${theme.colors.primary.muted}`,
  background: theme.colors.background.elevated,
  color: theme.colors.background.text,
});
