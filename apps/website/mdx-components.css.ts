import { style } from '@vanilla-extract/css';
import { gridLines } from './layouts/grid.lines';

export const mdxImage = style({
  gridColumn: gridLines.content,
  blockSize: 'auto',
  inlineSize: 'auto',
  marginInline: 'auto',
  maxInlineSize: '100%',
  borderRadius: '2px',
});
