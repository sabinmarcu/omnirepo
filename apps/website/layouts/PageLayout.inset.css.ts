import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';
import { mobileMedia } from '@/utils/responsive';
import { gridLines } from './grid.lines';

export const pageLayoutInsetStyles = recipe({
  variants: {
    variant: {
      wide: {},
    },
  },
  base: {
    background: theme.colors.background.recessed,
    marginBlock: theme.grid.xl,
    paddingBlock: theme.grid.xl,
    display: 'grid',
    gridColumn: gridLines.full,
    gridTemplateColumns: 'subgrid',
  },
});

globalStyle(`${pageLayoutInsetStyles.classNames.base} > [data-container]`, {
  marginBlockStart: '0',
  marginBlockEnd: '0',
  gridColumn: gridLines.content,
  ...mobileMedia({
    gridColumn: `${gridLines.contentStart} / ${gridLines.fullEnd}`,
  }),
});

globalStyle(`${pageLayoutInsetStyles.classNames.variants.variant.wide} > [data-container]`, {
  gridColumn: gridLines.wide,
});

export type PageLayoutInsetStylesProps = RecipeVariants<typeof pageLayoutInsetStyles>;
