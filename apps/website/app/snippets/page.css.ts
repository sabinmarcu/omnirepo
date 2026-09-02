import { navigationMinBlockSize } from '@/layouts/Navigation.css';
import { gridLines } from '@/layouts/grid.lines';
import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  style,
} from '@vanilla-extract/css';

const spacing = createVar();
export const snippetsPageStyles = style({
  display: 'grid',
  gridColumn: gridLines.full,
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: spacing,
  paddingBlockStart: `calc(${spacing} * 2)`,
  paddingInlineStart: spacing,
  paddingInlineEnd: spacing,
  vars: {
    [spacing]: theme.grid.l,
  },
  ...mobileMedia({
    display: 'flex',
    flexFlow: 'column nowrap',
    paddingBlockStart: `calc(${navigationMinBlockSize} + ${spacing} * 2)`,
  }),
});
