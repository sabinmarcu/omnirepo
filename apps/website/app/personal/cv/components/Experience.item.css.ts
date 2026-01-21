import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  theme,
} from '@sabinmarcu/theme';

const rawGrids = [
  'title',
  'duration',
  'location',
  'content',
] as const;

export const grids = Object.fromEntries(
  rawGrids.map((it) => [it, it]),
) as unknown as { [Key in typeof rawGrids[number]]: Key };

export const experienceItemStyles = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: '1rem',
  gridTemplateAreas: [
    [grids.title, grids.title],
    [grids.duration, grids.location],
    [grids.content, grids.content],
  ].map((it) => `"${it.join(' ')}"`).join('\n'),
});

for (const grid of Object.values(grids)) {
  globalStyle(`${experienceItemStyles} [data-grid=${grid}]`, {
    gridArea: grid,
  });
}

globalStyle(`${experienceItemStyles} [data-grid=${grids.title}]`, {
  marginBlockEnd: theme.grid.xxs,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
});

globalStyle(`${experienceItemStyles} [data-grid=${grids.duration}]`, {
  marginBlockEnd: theme.grid.s,
});

globalStyle(`${experienceItemStyles} [data-grid=${grids.content}]`, {
  opacity: 0.8,
});
