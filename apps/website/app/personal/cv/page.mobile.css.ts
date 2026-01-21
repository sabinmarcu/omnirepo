import { globalStyle } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { mobileMedia } from '@/utils/responsive';
import {
  cvPageBioStyles,
  cvPageStyles,
} from './page.css';

globalStyle(`${cvPageStyles} ${cvPageBioStyles} h1`, {
  fontSize: `calc(${theme.grid.xxl} * 2)`,
  lineHeight: '1.2em',
});

globalStyle(`${cvPageStyles} ${cvPageBioStyles} p`, {
  ...mobileMedia({
    fontSize: theme.grid.xl,
  }),
});
