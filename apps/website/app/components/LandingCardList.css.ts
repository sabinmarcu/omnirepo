import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  style,
} from '@vanilla-extract/css';

const listSpacing = createVar('list-spacing');
export const landingPageList = style({
  maxInlineSize: '1200px',
  inlineSize: '100cqw',

  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',

  marginBlockStart: theme.grid.xxl,

  paddingBlockStart: listSpacing,
  paddingBlockEnd: listSpacing,
  paddingInlineStart: listSpacing,
  paddingInlineEnd: listSpacing,

  gap: listSpacing,

  vars: {
    [listSpacing]: theme.grid.xl,
  },
});