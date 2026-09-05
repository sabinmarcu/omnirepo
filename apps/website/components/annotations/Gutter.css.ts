import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const gutterSpacing = createVar('code-gutter-spacing');
globalStyle(':root', {
  vars: {
    [gutterSpacing]: theme.grid.s,
  },
});

export const gutterStyle = style({
  marginInline: gutterSpacing,
});

globalStyle(`${gutterStyle} ~ * ${gutterStyle}`, {
  marginInlineStart: 0,
});
