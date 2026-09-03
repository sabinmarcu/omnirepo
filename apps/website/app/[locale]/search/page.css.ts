import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';
import { gridLines } from '@/layouts/grid.lines';

export const searchPageStyle = style({
  gridColumn: gridLines.content,
  display: 'grid',
  gap: theme.grid.xl,
  paddingBlock: theme.grid.xl,
});
