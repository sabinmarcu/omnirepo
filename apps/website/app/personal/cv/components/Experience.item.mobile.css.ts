import { globalStyle } from '@vanilla-extract/css';
import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import { gridStyles } from '@/components/Grid.css';
import {
  experienceItemBorderSize,
  experienceItemPadding,
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
  ...mobileMedia({
    marginBlockEnd: 0,
  }),
});

globalStyle(`${experienceItemStyles}${experienceItemStyles} :is(ul, ol)`, {
  ...mobileMedia({
    marginInlineStart: theme.grid.s,
  }),
});

globalStyle(`${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}`, {
  ...mobileMedia({
    borderBlockStartWidth: experienceItemBorderSize,
    paddingBlockStart: experienceItemPadding,
  }),
});

globalStyle([
  `:not(${experienceItemStyles}) + ${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}`,
  `:not(${experienceItemStyles}) + ${gridStyles.classNames.base} ${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}:first-of-type`,
  `${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty) + ${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}${experienceItemStyles}`,
].join(', '), {
  ...mobileMedia({
    paddingBlockStart: 0,
    borderBlockStartWidth: 0,
  }),
});
