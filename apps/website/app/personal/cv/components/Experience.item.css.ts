import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  theme,
} from '@sabinmarcu/theme';
import { grids } from './Experience.item.grid';

export const experienceItemStyles = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: '1rem',
  gridTemplateAreas: grids.mapper(({
    title,
    duration,
    location,
    content,
  }) => [
    [title, title],
    [duration, location],
    [content, content],
  ]),
});

grids.renderer(experienceItemStyles);

globalStyle(grids.extend('title', experienceItemStyles), {
  marginBlockEnd: theme.grid.xxs,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
});

globalStyle(grids.extend('duration', experienceItemStyles), {
  marginBlockEnd: theme.grid.s,
});

globalStyle(grids.extend('content', experienceItemStyles), {
  opacity: 0.8,
});
