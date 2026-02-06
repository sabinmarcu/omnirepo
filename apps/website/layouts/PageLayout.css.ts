import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const pageLayoutStyles = recipe({
  variants: {
    variant: {
      large: {
        maxInlineSize: '1200px',
      },
    },
  },
  base: {
    maxInlineSize: '1000px',
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

export const pageLayoutSelector = pageLayoutStyles.classNames.base;
globalStyle(`${pageLayoutSelector} h1`, {
  fontSize: '3.5rem',
});

export type PageLayoutStylesProps = RecipeVariants<typeof pageLayoutStyles>;