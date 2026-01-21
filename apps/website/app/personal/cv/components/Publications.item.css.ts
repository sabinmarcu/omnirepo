import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const publicationsItemStyle = style({});

globalStyle(`${publicationsItemStyle} > p`, {
  fontSize: theme.grid.xxl,
  lineHeight: '1em',
});
