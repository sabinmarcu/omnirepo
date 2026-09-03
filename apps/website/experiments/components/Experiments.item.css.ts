import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { grids } from './Experiments.item.grid';

export const experimentsItemStyles = style({
  display: 'grid',
  gridTemplateColumns: '3rem 1fr',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: grids.mapper(({
    checkbox,
    title,
    description,
  }) => [
    [checkbox, title],
    ['empty' as any, description],
  ] as const),

  fontSize: theme.grid.m,
  borderBlockStart: `dashed 2px ${theme.colors.background.elevated}`,
  paddingBlock: theme.grid.xxs,
});

grids.renderer(experimentsItemStyles);

globalStyle(grids.extend('checkbox', experimentsItemStyles), {
  display: 'inline-grid',
  placeItems: 'center',
});

globalStyle(grids.extend('description', experimentsItemStyles), {
  opacity: 0.5,
});
