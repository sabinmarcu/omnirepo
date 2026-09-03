import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { gridLines } from '@/layouts/grid.lines';

export const codeSectionSpacing = createVar();
export const codeSectionStyle = style({
  display: 'contents',
});

globalStyle(`${codeSectionStyle} > *`, {
  gridColumn: gridLines.content,
});

globalStyle(`${codeSectionStyle} > h2`, {
  fontSize: `calc(${theme.grid.xl} * 1.25)`,
  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',
});

globalStyle(`${codeSectionStyle}:not(:first-of-type) > h2`, {
  marginBlockStart: `calc(${codeSectionSpacing} * 2)`,
});

globalStyle([
  `${codeSectionStyle} > h2:not(:has(+ p))`,
  `${codeSectionStyle} > p`,
].join(', '), {
  marginBlockEnd: theme.grid.m,
});

globalStyle(`${codeSectionStyle} > p`, {
  marginBlockStart: theme.grid.s,
});
