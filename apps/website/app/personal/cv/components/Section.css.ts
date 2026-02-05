import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const sectionStyles = style({
  float: 'inline-end',
  maxInlineSize: '30cqw',
  marginInlineStart: theme.grid.xxl,
  marginBlockEnd: theme.grid.xxl,
});

globalStyle(`${sectionStyles} h2`, {
  borderBlockEnd: `solid 2px ${theme.colors.primary.muted}`,
  color: theme.colors.primary.base,
  lineHeight: '0.75em',
  fontSize: `calc(${theme.grid.xxl} * 1.6)`,
  paddingBlockEnd: theme.grid.s,
  marginBlockEnd: theme.grid.l,
});

globalStyle(`${sectionStyles} h3 `, {
  lineHeight: '0.75em',
  fontSize: theme.grid.xxl,
});
