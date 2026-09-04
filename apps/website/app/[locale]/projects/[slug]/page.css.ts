import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const projectResourceLinkStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.grid.s,
});

export const projectDatesStyle = style({
  color: theme.colors.background.text,
  marginBlock: 0,
  opacity: 0.7,
});
