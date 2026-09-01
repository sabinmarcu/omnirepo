import { theme } from '@sabinmarcu/website-theme';
import type { StyleRule } from '@vanilla-extract/css';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

/** Inline sizes, in px, that the page content column is allowed to grow to. */
export const pageLayoutSizes = {
  base: 1000,
  large: 1200,
} as const;

/** Anchor exposed so out-of-flow siblings (the TOC) can position against the content column. */
export const pageLayoutAnchorName = '--page-layout-content';

export const pageLayoutSize = createVar();
export const pageLayoutStyles = recipe({
  variants: {
    variant: {
      large: {},
    },
  },
});

globalStyle(`:where(${pageLayoutStyles.classNames.base})`, {
  maxInlineSize: pageLayoutSize,
  display: 'block',
  marginBlockStart: '0',
  marginBlockEnd: '0',
  marginInlineStart: 'auto',
  marginInlineEnd: 'auto',
  fontSize: '1.3rem',
  container: 'page-layout',
  containerType: 'inline-size',
  paddingInline: theme.grid.m,
  ...({ anchorName: pageLayoutAnchorName } as StyleRule),
});

// Class specificity, so the `*` padding reset in globals cannot win the cascade.
globalStyle(`body:has(${pageLayoutStyles.classNames.base} )`, {
  vars: {
    [pageLayoutSize]: `${pageLayoutSizes.base}px`,
  },
});

globalStyle(`body:has(${pageLayoutStyles.classNames.variants.variant.large})`, {
  vars: {
    [pageLayoutSize]: `${pageLayoutSizes.large}px`,
  },
});

export const pageLayoutLargeSelector = pageLayoutStyles.classNames.variants.variant.large;

export const pageLayoutSelector = pageLayoutStyles.classNames.base;
globalStyle(`${pageLayoutSelector} h1`, {
  fontSize: '3.5rem',
  lineHeight: '1em',
});

export type PageLayoutStylesProps = RecipeVariants<typeof pageLayoutStyles>;
