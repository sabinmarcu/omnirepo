import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const gridColummns = createVar();
const gridContainerStyles: Parameters<typeof globalStyle>[1] = {
  columns: gridColummns,
  gap: theme.grid.xxl,
  paddingBlock: theme.grid.xs,
} as const;

export const gridStyles = recipe({
  variants: {
    large: {
      true: {
        marginBlock: theme.grid.m,
      },
    },
    center: {
      true: {
        textAlign: 'center',
      },
    },
  },
  base: {
    selectors: {
      '&:not(:has(> :is(ul, ol)))': {
        ...gridContainerStyles,
      },
    },
  },
});

globalStyle(`${gridStyles.classNames.base} > *`, {
  textAlign: 'inherit',
});

globalStyle(`${gridStyles.classNames.base} :is(ul, ol)`, {
  ...gridContainerStyles,
  marginInlineStart: theme.grid.m,
});

globalStyle(`${gridStyles.classNames.base} :is(ul, ol) li`, {
  display: 'list-item',
});

globalStyle(`${gridStyles.classNames.variants.center.true}:not(:has(> :is(ul, ol))) > :first-child`, {
  textAlign: 'left',
});
globalStyle(`${gridStyles.classNames.variants.center.true}:not(:has(> :is(ul, ol))) > :last-child`, {
  textAlign: 'right',
});

globalStyle(`${gridStyles.classNames.variants.center.true} :is(ul, ol) :first-child`, {
  textAlign: 'left',
});
globalStyle(`${gridStyles.classNames.variants.center.true} :is(ul, ol) :last-child`, {
  textAlign: 'right',
});

export type GridStylesProps = RecipeVariants<typeof gridStyles>;
