import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const codeStyles = style({
  background: theme.colors.background.surface,

  paddingBlock: theme.grid.m,
  paddingInline: theme.grid.m,

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',
});
