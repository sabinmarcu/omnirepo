import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const projectResourceLinkStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.grid.s,
});
