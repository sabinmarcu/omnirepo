import { mobileMedia } from '@/utils/responsive';
import { globalStyle } from '@vanilla-extract/css';
import { navigationSelector } from './Navigation.css';
import { navigationAnchorOffset } from './Navigation.anchor.css';
import { grids } from './Navigation.grid';

globalStyle(`body:has(${navigationSelector})`, {
  ...mobileMedia({
    vars: {
      [navigationAnchorOffset]: '0px',
    },
  }),
});

globalStyle(`body:has(${navigationSelector} ${grids.rawSelector('minor')})`, {
  ...mobileMedia({
    vars: {
      [navigationAnchorOffset]: '0px',
    },
  }),
});
