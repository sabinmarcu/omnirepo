import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const gridColumns = createVar();
const gridContainerStyles: Parameters<typeof globalStyle>[1] = {
  columns: gridColumns,
  paddingBlock: theme.grid.xs,
} as const;

export const gridStyles = recipe({
  variants: {
    large: {
      true: {
        marginBlock: theme.grid.m,
      },
    },
    grid: {
      true: {
        display: 'grid',
        columns: 'initial',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: theme.grid.xxl,
      },
    },
  },
  base: {
    selectors: {
      '&:not(:has(:is(ul, ol)))': {
        ...gridContainerStyles,
      },
    },
  },
});

globalStyle(`${gridStyles.classNames.variants.grid.true}`, {
  display: 'grid-lanes',
});

globalStyle(`${gridStyles.classNames.base} > *`, {
  textAlign: 'inherit',
});

globalStyle(`${gridStyles.classNames.base}:not(${gridStyles.classNames.variants.grid.true}) :is(ul, ol)`, {
  ...gridContainerStyles,
  marginInlineStart: theme.grid.m,
});

globalStyle(`${gridStyles.classNames.base} :is(ul, ol) li`, {
  display: 'list-item',
});

export type GridStylesProps = RecipeVariants<typeof gridStyles>;
