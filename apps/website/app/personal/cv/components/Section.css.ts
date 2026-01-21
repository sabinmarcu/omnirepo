import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

const sectionGrids = {
  main: 'main',
  secondary: 'secondary',
} as const;

export const sectionStyles = style({});

globalStyle(`${sectionStyles}:has(> article ~ article)`, {
  display: 'grid',
  gridTemplateColumns: '1fr 30cqw',
  gridTemplateAreas:
    `"${sectionGrids.main} ${sectionGrids.secondary}"`,
  gap: theme.grid.xl,
});

globalStyle(`${sectionStyles} > article:first-child`, {
  gridArea: sectionGrids.main,
});

globalStyle(`${sectionStyles} > article:last-child:not(:only-child)`, {
  gridArea: sectionGrids.secondary,
});

globalStyle(`${sectionStyles} h2`, {
  borderBlockEnd: `solid 2px ${theme.colors.primary.muted}`,
  color: theme.colors.primary.base,
  lineHeight: '0.75em',
  fontSize: `calc(${theme.grid.xxl} * 1.6)`,
  paddingBlockEnd: theme.grid.s,
  marginBlockEnd: theme.grid.l,
});

globalStyle(`${sectionStyles} h3 `, {
  lineHeight: '0.75em',
  fontSize: theme.grid.xxl,
});
