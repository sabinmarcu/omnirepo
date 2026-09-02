import { theme } from '@sabinmarcu/theme';
import {
  style,
} from '@vanilla-extract/css';

export const sectionStyles = style({
  float: 'inline-end',
  maxInlineSize: '30cqw',
  marginInlineStart: theme.grid.xl,
  marginBlockEnd: theme.grid.xl,
});
