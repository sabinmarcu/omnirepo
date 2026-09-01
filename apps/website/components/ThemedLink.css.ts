import { theme } from '@sabinmarcu/theme';
import {
  createVar,
} from '@vanilla-extract/css';
import {
  recipe,
  type RecipeVariants,
} from '@vanilla-extract/recipes';

export const themedLinkColor = createVar();
export const themedLinkStyle = recipe({
  variants: {
    variant: {
      primary: {
        vars: {
          [themedLinkColor]: theme.colors.primary.base,
        },
        selectors: {
          '&:visited': {
            vars: {
              [themedLinkColor]: theme.colors.primary.muted,

            },
          },
        },
      },
      secondary: {
        vars: {
          [themedLinkColor]: theme.colors.secondary.base,
        },
        selectors: {
          '&:visited': {
            vars: {
              [themedLinkColor]: theme.colors.secondary.muted,
            },
          },
        },
      },
    },
  },
  base: {
    textDecoration: 'none',
    color: themedLinkColor,
  },
});

export type ThemedLinkStyleProps = RecipeVariants<typeof themedLinkStyle>;
