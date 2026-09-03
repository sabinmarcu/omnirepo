import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  experienceItemPadding,
  experienceItemStyles,
} from '../../personal/cv/components/Experience.item.css';
import { grids as experienceItemGrids } from '../../personal/cv/components/Experience.item.grid';
import { showcaseListStyle } from '@/components/ShowcaseList.css';
import { footerStyles } from '@/layouts/Footer.css';
import { gridLines } from '@/layouts/grid.lines';

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
  paddingBlock: theme.grid.xl,
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

const projectResultSelector = `${resultGroupStyle}[data-content-type="project"]`;
const projectExperienceItemSelector = `${projectResultSelector} ${experienceItemStyles}`;

globalStyle(projectExperienceItemSelector, {
  display: 'grid',
  gridTemplateColumns: 'minmax(14rem, 1fr) minmax(0, 2fr)',
  columnGap: theme.grid.xl,
  rowGap: theme.grid.s,
  vars: {
    [experienceItemPadding]: theme.grid.m,
  },
});

globalStyle(projectExperienceItemSelector, {
  display: 'grid-lanes',
  columns: 2,
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('summary')}`, {
  gridColumn: 1,
  gridRow: 1,
  display: 'grid',
  alignContent: 'start',
  gap: theme.grid.xxs,
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('title')}`, {
  display: 'grid',
  justifyContent: 'initial',
  alignContent: 'start',
  lineHeight: '1em',
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > a`, {
  display: 'grid',
  gap: theme.grid.xxs,
});

globalStyle([
  `${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > span:nth-child(3):empty`,
  `${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('title')} > a > span:nth-child(3):empty`,
].join(', '), {
  display: 'none',
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('metadata')}`, {
  display: 'block',
  alignItems: 'start',
  justifyContent: 'start',
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('location')}`, {
  display: 'none',
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('content')}`, {
  gridColumn: 2,
  gridRow: 1,
  marginBlockStart: 0,
});

globalStyle(`${projectExperienceItemSelector} ${experienceItemGrids.rawSelector('skills')}`, {
  gridColumn: 2,
  gridRow: 2,
});

globalStyle(`${projectResultSelector} ${resultListStyle} > li:first-child ${experienceItemStyles}`, {
  paddingBlockStart: 0,
  borderBlockStartWidth: 0,
});
