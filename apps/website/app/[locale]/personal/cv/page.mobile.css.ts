import { globalStyle } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { mobileMedia } from '@/utils/responsive';
import {
  cvPageBioStyles,
  cvPageStyles,
} from './page.css';

globalStyle(cvPageStyles, {
  ...mobileMedia({
    paddingBlockStart: '2cqh',
  }),
});

globalStyle(`${cvPageStyles} ${cvPageBioStyles} h1`, {
  ...mobileMedia({
    fontSize: `calc(${theme.grid.xl} * 3)`,
    lineHeight: '0.8em',
    paddingBlockEnd: '0.2em',
  }),
});

globalStyle(`${cvPageStyles} ${cvPageBioStyles} p`, {
  ...mobileMedia({
    fontSize: theme.grid.l,
  }),
});