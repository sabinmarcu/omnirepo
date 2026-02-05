import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  theme,
} from '@sabinmarcu/theme';
import { grids } from './Experience.item.grid';
import {
  gridColumns,
  gridStyles,
} from './Grid.css';

const experienceItemBorderSize = createVar();
export const experienceItemStyles = style({
  display: 'flex',
  flexFlow: 'column',
  paddingBlock: theme.grid.l,
  borderBlockStart: `dashed ${experienceItemBorderSize} ${theme.colors.background.elevated}`,
  vars: {
    [experienceItemBorderSize]: '2px',
  },
});

globalStyle(`:not(${experienceItemStyles}) + ${experienceItemStyles}`, {
  paddingBlockStart: 0,
  borderBlockStart: 'none',
});

globalStyle(`${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty)`, {
  paddingBlockEnd: 0,
});

globalStyle(`${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty) + ${experienceItemStyles}`, {
  paddingBlockStart: 0,
  borderBlockStart: 'none',
});

globalStyle([
  `${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty) + ${experienceItemStyles} ${grids.rawSelector('title')} span:last-of-type:not(:only-child)`,
  `${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty) + ${experienceItemStyles} ${grids.rawSelector('location')}`,
].join(', '), {
  display: 'none',
});

globalStyle(grids.extend('title', experienceItemStyles), {
  marginBlockEnd: theme.grid.xxs,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

globalStyle(grids.extend('metadata', experienceItemStyles), {
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.grid.xxl,
  marginBlockEnd: theme.grid.m,
});

globalStyle(grids.extend('content', experienceItemStyles), {
  opacity: 0.8,
});

globalStyle(`${experienceItemStyles} > *`, {
  maxInlineSize: '100cqw',
});

globalStyle(`${grids.extend('content', experienceItemStyles)} h3:not(:first-child)`, {
  marginBlockStart: theme.grid.l,
});

globalStyle(`${grids.extend('content', experienceItemStyles)} h3`, {
  marginBlockEnd: theme.grid.xxs,
  fontSize: theme.grid.xl,
});

globalStyle(grids.extend('title', experienceItemStyles), {
  lineHeight: '0.75em',
  fontSize: theme.grid.xxl,
});

for (const columns of Array.from({ length: 5 }).fill(0).map((_, index) => index)) {
  globalStyle(`:not(${experienceItemStyles}) + ${gridStyles.classNames.variants.grid.true} ${experienceItemStyles}:nth-child(${columns})`, {
    borderBlockStartWidth: `calc(clamp(0, calc(${columns} - ${gridColumns}), 1) * ${experienceItemBorderSize})`,
  });
}
