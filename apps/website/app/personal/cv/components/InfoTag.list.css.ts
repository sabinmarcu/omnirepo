import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const infoTagListStyles = style({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-between',
  gap: theme.grid.xxl,
  marginBlock: theme.grid.m,
});
