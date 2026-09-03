import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { showcaseListStyle } from '@/components/ShowcaseList.css';
import { footerStyles } from '@/layouts/Footer.css';
import { gridLines } from '@/layouts/grid.lines';
import { grids as experienceItemGrids } from '../../personal/cv/components/Experience.item.grid';
import {
  experienceItemPadding,
  experienceItemStyles,
} from '../../personal/cv/components/Experience.item.css';

export const tagPageStyle = style({
  display: 'grid',
  gap: theme.grid.xl,
  paddingBlock: theme.grid.xl,
});

export const tagHeaderStyle = style({
  display: 'grid',
  gap: theme.grid.m,
});

export const tagFooterStyle = style({});

globalStyle(`${tagFooterStyle} ${footerStyles}`, {
  borderBlockStart: 'none',
});

export const tagDescriptionStyle = style({
  display: 'grid',
  gap: theme.grid.m,
});

export const tagListStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.s,
});

export const resultGroupStyle = style({
  display: 'grid',
  gridColumn: gridLines.full,
  gridTemplateColumns: 'subgrid',
  gap: theme.grid.xl,
});

export const resultListStyle = style({
  display: 'grid',
  gridColumn: gridLines.content,
  gap: theme.grid.m,
  padding: 0,
  listStyle: 'none',
});

globalStyle(`${resultGroupStyle} > h3`, {
  paddingBlockStart: theme.grid.xl,
  fontSize: '3.5rem',
  lineHeight: '1em',
});

globalStyle(`${resultGroupStyle} > :is(h3, ${tagListStyle})`, {
  gridColumn: gridLines.content,
});

globalStyle(`${resultGroupStyle}[data-content-type]`, {
  borderBlockStart: `solid 2px ${theme.colors.background.elevated}`,
  background: theme.colors.background.page,
  paddingBlockEnd: theme.grid.xl,
});

globalStyle(`${resultGroupStyle} ${showcaseListStyle}`, {
  paddingBlockStart: 0,
});

const compactCvResultSelector = [
  `${resultGroupStyle}[data-content-type="project"]`,
  `${resultGroupStyle}[data-content-type="experience"]`,
].join(', ');
const compactCvResultScopeSelector = `:is(${compactCvResultSelector})`;
const compactCvExperienceItemSelector = `${compactCvResultScopeSelector} ${experienceItemStyles}`;

globalStyle(`${compactCvResultScopeSelector} ${resultListStyle}`, {
  paddingBlockStart: theme.grid.xl,
});

globalStyle(compactCvExperienceItemSelector, {
  display: 'grid',
  gridTemplateColumns: 'minmax(14rem, 1fr) minmax(0, 2fr)',
  columnGap: theme.grid.xl,
  rowGap: theme.grid.s,
  vars: {
    [experienceItemPadding]: theme.grid.m,
  },
});

globalStyle(compactCvExperienceItemSelector, {
  display: 'grid-lanes',
  columns: 2,
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('summary')}`, {
  gridColumn: 1,
  gridRow: 1,
  display: 'grid',
  alignContent: 'start',
  gap: theme.grid.xxs,
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('title')}`, {
  display: 'grid',
  justifyContent: 'initial',
  alignContent: 'start',
  lineHeight: '1em',
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > a`, {
  display: 'grid',
  gap: theme.grid.xxs,
});

globalStyle([
  `${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > span:nth-child(3):empty`,
  `${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > a > span:nth-child(3):empty`,
].join(', '), {
  display: 'none',
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('metadata')}`, {
  display: 'block',
  alignItems: 'start',
  justifyContent: 'start',
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('location')}`, {
  display: 'none',
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('content')}`, {
  gridColumn: 2,
  gridRow: 1,
  marginBlockStart: 0,
});

globalStyle(`${compactCvExperienceItemSelector} ${experienceItemGrids.rawSelector('skills')}`, {
  gridColumn: 2,
  gridRow: 2,
});

globalStyle(`${compactCvResultScopeSelector} ${resultListStyle} > li:first-child ${experienceItemStyles}`, {
  paddingBlockStart: 0,
  borderBlockStartWidth: 0,
});
