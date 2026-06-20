import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const bioPageStyles = style({});

globalStyle(`${bioPageStyles} p`, {
  marginBlock: theme.grid.l,
});

globalStyle(`${bioPageStyles} hr`, {
  marginBlock: theme.grid.xxl,
  borderStyle: 'dashed',
});
