import { navigationMinBlockSize } from '@/layouts/Navigation.css';
import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

const spacing = createVar();
export const toolsPageStyles = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  containerType: 'inline-size',
  maxInlineSize: 'initial',
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

globalStyle(`${toolsPageStyles} > *`, {
  maxInlineSize: '50cqw',
});