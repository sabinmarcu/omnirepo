import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import {
  codeSectionSpacing,
  codeSectionStyle,
} from './page.css';

export const snippetLayoutPageStyles = style({
  vars: {
    [codeSectionSpacing]: theme.grid.xxl,
  },
});

globalStyle(`${snippetLayoutPageStyles} > h1:not(:has(+ ${codeSectionStyle} h2))`, {
  paddingBlockEnd: codeSectionSpacing,
});