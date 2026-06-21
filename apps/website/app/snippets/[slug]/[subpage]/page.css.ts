import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const codeSectionSpacing = createVar();
export const codeSectionStyle = style({});

globalStyle(`${codeSectionStyle} > h2`, {
  fontSize: `calc(${theme.grid.xl} * 1.25)`,
});

globalStyle(`${codeSectionStyle}:not(:first-of-type) > h2`, {
  paddingBlockStart: `calc(${codeSectionSpacing} * 2)`,
});

globalStyle(`${codeSectionStyle} > h2:not(:has(+ p))`, {
  paddingBlockEnd: theme.grid.m,
});

globalStyle(`${codeSectionStyle} > p`, {
  fontSize: theme.grid.l,
  paddingBlockEnd: theme.grid.m,
});
