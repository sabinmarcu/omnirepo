import { theme } from '@sabinmarcu/website-theme';
import { style } from '@vanilla-extract/css';
import { gridLines } from '@/layouts/grid.lines';

export const tagsPageStyle = style({
  gridColumn: gridLines.content,
  display: 'grid',
  gap: theme.grid.xl,
  paddingBlock: theme.grid.xl,
});

export const tagSectionStyle = style({
  display: 'grid',
  gap: theme.grid.m,
});

export const tagListStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.s,
});
