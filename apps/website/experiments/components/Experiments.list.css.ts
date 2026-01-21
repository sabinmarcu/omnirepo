import { theme } from '@sabinmarcu/theme';
import {
  style,
} from '@vanilla-extract/css';

export const experimentsListStyles = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  paddingBlockEnd: theme.grid.m,
});

