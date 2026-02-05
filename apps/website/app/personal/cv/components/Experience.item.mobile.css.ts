import { globalStyle } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import {
  experienceItemStyles,
} from './Experience.item.css';
import { grids } from './Experience.item.grid';

globalStyle(`${experienceItemStyles}`, {
  ...mobileMedia({
    gridTemplateAreas: grids.mapper(({
      title,
      duration,
      location,
      content,
    }) => [
      [title, title],
      [duration, duration],
      [location, location],
      [content, content],
    ]),
  }),
});

globalStyle(`${experienceItemStyles} ${grids.rawSelector('duration')}:has(+ ${grids.rawSelector('location')})`, {
  marginBlockEnd: 0,
});

