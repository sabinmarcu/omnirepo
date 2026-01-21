import { globalStyle } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import {
  experienceItemStyles,
  grids,
} from './Experience.item.css';

globalStyle(`${experienceItemStyles}`, {
  ...mobileMedia({
    gridTemplateAreas: [
      [grids.title, grids.title],
      [grids.duration, grids.duration],
      [grids.location, grids.location],
      [grids.content, grids.content],
    ].map((it) => `"${it.join(' ')}"`).join('\n'),
  }),
});

globalStyle(`${experienceItemStyles} [data-grid=${grids.duration}]:not(:has(+ [data-grid=${grids.location}]))`, {
  marginBlockEnd: theme.grid.s,
});

globalStyle(`${experienceItemStyles} [data-grid=${grids.duration}]:has(+ [data-grid=${grids.location}])`, {
  marginBlockEnd: 0,
});

globalStyle(`${experienceItemStyles} [data-grid=${grids.location}]`, {
  marginBlockEnd: theme.grid.m,
});

