import { style } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';

export const projectListStyle = style({
  alignItems: 'start',
  ...mobileMedia({
    alignItems: 'stretch',
  }),
});
