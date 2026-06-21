import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const footerStyles = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  marginBlockStart: '3cqh',
  paddingBlockStart: '1cqh',
  paddingBlockEnd: '5cqh',
  color: theme.colors.primary.muted,
  gap: theme.grid.s,
  borderBlockStart: `dashed 2px ${theme.colors.background.elevated}`,
});

globalStyle(`${footerStyles} p`, {
  paddingBlockStart: 0,
  paddingBlockEnd: 0,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,
  marginBlockStart: 0,
  marginBlockEnd: 0,
  marginInlineStart: 0,
  marginInlineEnd: 0,
});