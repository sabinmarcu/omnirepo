import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  theme,
} from '@sabinmarcu/theme';
import {
  gridColumns,
  gridStyles,
} from '@/components/Grid.css';
import { grids } from './Experience.item.grid';
import { cvPageSpacing } from '../page.css';

export const experienceItemBorderSize = createVar();
export const experienceItemPadding = createVar();
export const experienceItemStyles = style({
  display: 'flex',
  flexFlow: 'column',
  paddingBlock: experienceItemPadding,
  borderBlockStart: `dashed ${experienceItemBorderSize} ${theme.colors.background.elevated}`,
  vars: {
    [experienceItemBorderSize]: '2px',
    [experienceItemPadding]: cvPageSpacing,
  },
});

globalStyle([
  `:not(${experienceItemStyles}) + ${experienceItemStyles}`,
  `${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty) + ${experienceItemStyles}`,
].join(', '), {
  paddingBlockStart: 0,
  borderBlockStartWidth: 0,
});

globalStyle(`${experienceItemStyles}:has(> ${grids.rawSelector('content')}:empty)`, {
  paddingBlockEnd: 0,
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
});

globalStyle(grids.extend('content', experienceItemStyles), {
  opacity: 0.8,
  marginBlockStart: theme.grid.m,
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
    paddingBlockStart: `calc(clamp(0, calc(${columns} - ${gridColumns}), 1) * ${experienceItemPadding})`,
  });
}