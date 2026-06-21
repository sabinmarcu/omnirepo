import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { mobileMedia } from '@/utils/responsive';
import {
  codeSectionSpacing,
  codeSectionStyle,
} from './page.css';

export const snippetLayoutPageStyles = style({
  vars: {
    [codeSectionSpacing]: theme.grid.xl,
  },
});

globalStyle(`${snippetLayoutPageStyles} > h1:not(:has(+ ${codeSectionStyle} h2))`, {
  paddingBlockEnd: codeSectionSpacing,
});
globalStyle(`${snippetLayoutPageStyles} > h1`, {
  ...mobileMedia({
    paddingBlockEnd: codeSectionSpacing,
  }),
});