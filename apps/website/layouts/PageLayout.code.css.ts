import { mobileMedia } from '@/utils/responsive';
import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

const contentSize = createVar();

export const pageLayoutCodeStyles = recipe({
  variants: {
    variant: {
      wide: {
        vars: {
          [contentSize]: '80vw',
        },
      },
    },
  },
  base: {
    background: theme.colors.background.depressed,
    paddingBlock: theme.grid.xl,
    marginInline: 'calc(0px - (100vw - 100cqw) / 2)',
    vars: {
      [contentSize]: '100cqw',
    },
  },
});

globalStyle(`${pageLayoutCodeStyles.classNames.base} > [data-container]`, {
  marginBlockStart: '0',
  marginBlockEnd: '0',
  marginInlineStart: 'auto',
  marginInlineEnd: 'auto',

  inlineSize: contentSize,
});

globalStyle(pageLayoutCodeStyles.classNames.base, {
  ...mobileMedia({
    vars: {
      [contentSize]: '100cqw',
    },
  }),
});

export type PageLayoutCodeStylesProps = RecipeVariants<typeof pageLayoutCodeStyles>;