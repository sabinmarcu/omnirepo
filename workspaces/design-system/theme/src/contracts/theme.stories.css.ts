import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { themeContract } from './theme.js';

export const swatchSet = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(5cqw, 10cqw) auto',
});

globalStyle(`${swatchSet} > *:first-child`, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  textTransform: 'uppercase',
});

export const wrapper = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: themeContract.grid.m,
});
