import { theme } from '@sabinmarcu/website-theme';
import type { StyleRule } from '@vanilla-extract/css';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';
import { gridLines } from './grid.lines';

/** Narrowest the page content column may compress to before the layout drops a gutter. */
export const pageLayoutMinSize = 800;

/** Inline sizes, in px, that the page content column is allowed to grow to. */
export const pageLayoutSizes = {
  base: 1000,
  large: 1200,
} as const;

/** Anchor exposed so out-of-flow siblings (the TOC) can position against the content column. */
export const pageLayoutAnchorName = '--page-layout-content';

/** Exposed so gutter-aligned siblings can match the content column's inline padding. */
export const pageLayoutInlinePadding = theme.grid.m;

export const pageLayoutSize = createVar();
export const pageLayoutStyles = recipe({
  variants: {
    variant: {
      large: {},
    },
  },
});

globalStyle(`:where(${pageLayoutStyles.classNames.base})`, {
  display: 'grid',
  gridTemplateColumns: [
    `[${gridLines.fullStart}]`,
    `minmax(${pageLayoutInlinePadding}, 1fr)`,
    `[${gridLines.wideStart}]`,
    'minmax(0, 2fr)',
    `[${gridLines.contentStart}]`,
    `minmax(0, ${pageLayoutSize})`,
    `[${gridLines.contentEnd}]`,
    'minmax(0, 2fr)',
    `[${gridLines.wideEnd}]`,
    `minmax(${pageLayoutInlinePadding}, 1fr)`,
    `[${gridLines.fullEnd}]`,
  ].join(' '),
  alignContent: 'start',
  gridAutoRows: 'auto',
  marginBlockStart: '0',
  marginBlockEnd: '0',
  container: 'page-layout',
  containerType: 'inline-size',
  ...({ anchorName: pageLayoutAnchorName } as StyleRule),
});

globalStyle(`:where(${pageLayoutStyles.classNames.base}) > *`, {
  gridColumn: gridLines.content,
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

export type PageLayoutStylesProps = RecipeVariants<typeof pageLayoutStyles>;
