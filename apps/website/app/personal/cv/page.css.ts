import { theme } from '@sabinmarcu/website-theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const cvPageSpacing = createVar();
export const cvPageStyles = style({
  container: 'cv-page',
  containerType: 'inline-size',
  paddingBlockStart: '3cqh',
  vars: {
    [cvPageSpacing]: theme.grid.l,
  },
});

globalStyle(`${cvPageStyles} [data-tagline]`, {
  fontSize: theme.grid.l,
  color: theme.colors.primary.muted,
});

export const cvPageBioStyles = style({});

globalStyle(`${cvPageStyles} ${cvPageBioStyles} h1`, {
  fontSize: `calc(${theme.grid.xl} * 3.5)`,
  lineHeight: '1em',
});

globalStyle(`${cvPageStyles} ${cvPageBioStyles} p`, {
  fontSize: theme.grid.xl,
  color: theme.colors.primary.muted,
});

globalStyle(`${cvPageStyles} h2`, {
  borderBlockEnd: `solid 2px ${theme.colors.primary.muted}`,
  color: theme.colors.primary.base,
  lineHeight: '1em',
  fontSize: `calc(${theme.grid.xl} * 1.6)`,
  paddingBlockEnd: theme.grid.s,
  marginBlockEnd: theme.grid.l,
  display: 'flex',
});

globalStyle(`${cvPageStyles} :is(ul, li)`, {
  marginInlineStart: theme.grid.s,
});