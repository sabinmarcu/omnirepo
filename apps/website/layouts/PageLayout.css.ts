import { theme } from '@sabinmarcu/website-theme';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const pageLayoutSize = createVar();
export const pageLayoutStyles = recipe({
  variants: {
    variant: {
      large: {},
    },
  },
  base: {
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
  },
});

globalStyle(`body:has(${pageLayoutStyles.classNames.base} )`, {
  vars: {
    [pageLayoutSize]: '1000px',
  },
});

globalStyle(`body:has(${pageLayoutStyles.classNames.variants.variant.large})`, {
  vars: {
    [pageLayoutSize]: '1200px',
  },
});

export const pageLayoutSelector = pageLayoutStyles.classNames.base;
globalStyle(`${pageLayoutSelector} h1`, {
  fontSize: '3.5rem',
});

export type PageLayoutStylesProps = RecipeVariants<typeof pageLayoutStyles>;