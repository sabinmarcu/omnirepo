import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import {
  navigationAnchorOffset,
} from './Navigation.anchor.css';

globalStyle([
  'body > *',
].join(', '), {
  ...mobileMedia({
    vars: {
      [navigationAnchorOffset]: theme.grid.m,
    },
  }),
});
