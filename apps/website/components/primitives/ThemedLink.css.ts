import { theme } from '@sabinmarcu/theme';
import {
  createVar,
} from '@vanilla-extract/css';
import {
  recipe,
  type RecipeVariants,
} from '@vanilla-extract/recipes';
import {
  themedLinkNoIconDataAttribute,
  themedLinkNoUnderlineDataAttribute,
  themedLinkUndecoratedDataAttribute,
} from './ThemedLink.constants';

export const themedLinkColor = createVar();
export const themedLinkIcon = createVar();
export const themedLinkIconSize = createVar();

function iconUrl(shape: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${shape}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const internalIcon = iconUrl("<path d='M4 12h13'/><path d='M12 6l6 6-6 6'/>");
const externalIcon = iconUrl("<path d='M14 4h6v6'/><path d='M20 4 11 13'/><path d='M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'/>");
const anchorIcon = iconUrl("<path d='M5 9h14'/><path d='M5 15h14'/><path d='M10 4 8 20'/><path d='M16 4l-2 16'/>");

// Each hatch opts out when it sits on the link itself or on any ancestor.
function escapeHatch(...attributes: string[]) {
  const matches = attributes
    .flatMap((attribute) => [`[${attribute}]`, `[${attribute}] *`])
    .join(', ');
  return {
    on: `&:is(${matches})`,
    off: `&:not(${matches})`,
  };
}

const underline = escapeHatch(
  themedLinkNoUnderlineDataAttribute,
  themedLinkUndecoratedDataAttribute,
);
const icon = escapeHatch(
  themedLinkNoIconDataAttribute,
  themedLinkUndecoratedDataAttribute,
);

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
    decoration: {
      auto: {
        selectors: {
          [underline.on]: {
            textDecorationLine: 'none',
          },
          [underline.off]: {
            textDecorationLine: 'underline',
            textDecorationThickness: 'from-font',
            textDecorationSkipInk: 'auto',
            textUnderlineOffset: '0.15em',
          },
          [`${underline.off}:hover`]: {
            textDecorationThickness: '2px',
          },
          [`${icon.off}::after`]: {
            content: '""',
            display: 'inline-block',
            verticalAlign: 'baseline',
            inlineSize: themedLinkIconSize,
            blockSize: themedLinkIconSize,
            marginInlineStart: '0.2em',
            backgroundColor: 'currentColor',
            maskImage: themedLinkIcon,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: themedLinkIcon,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          },
        },
      },
      none: {
        textDecorationLine: 'none',
      },
    },
  },
  defaultVariants: {
    decoration: 'auto',
  },
  base: {
    color: themedLinkColor,
    vars: {
      [themedLinkIcon]: internalIcon,
      [themedLinkIconSize]: `calc(${theme.grid.m} * 0.75)`,
    },
    selectors: {
      '&[data-link-kind="external"]': {
        vars: { [themedLinkIcon]: externalIcon },
      },
      '&[data-link-kind="anchor"]': {
        vars: { [themedLinkIcon]: anchorIcon },
      },
    },
  },
});

export type ThemedLinkStyleProps = RecipeVariants<typeof themedLinkStyle>;
