import { theme } from '@sabinmarcu/website-theme';
import type { StyleRule } from '@vanilla-extract/css';
import {
  globalStyle,
  createVar,
} from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { zIndexLayers } from '@/constants/layers';
import { themedLinkStyle } from '@/components/ThemedLink.css';
import { grids } from './Navigation.grid';
import {
  blendAnimation,
  blendSize,
  navigationAnimation,
  navigationAnimationPercent,
} from './Navigation.animation.css';
import {
  rootPageLayoutStyles,
  rootScrollTimeline,
} from './RootPageLayout.css';

/** Anchor exposed so out-of-flow siblings (the TOC) can position against the navbar's real box. */
export const navigationAnchorName = '--navigation';

export const navigationSpacing = createVar();
export const navigationMinBlockSize = createVar();
export const navigationMinInlineSize = createVar();
export const navigationBlockOffset = createVar();
export const navigationRows = createVar();
export const navigationMobileElements = createVar();
export const navigationInlineOffset = createVar();
export const navigationStyles = recipe({
  variants: {
    empty: {
      true: {
        position: 'fixed',
      },
    },
    animated: {
      true: {
        animation: navigationAnimation,
        animationTimeline: rootScrollTimeline,
        vars: {
          [navigationAnimationPercent]: '0%',
        },
      },
    },
  },
  base: {
    position: 'sticky',
    zIndex: zIndexLayers.navigation,

    insetBlockStart: 0,
    insetInline: 0,

    display: 'grid',
    gridTemplateColumns: '1fr fit-content(10rem)',
    gridTemplateAreas: grids.mapper(({
      major,
      minor,
      settings,
    }) => [
      [major, settings],
      [minor, minor],
    ]),

    fontSize: theme.grid.l,

    ...({ anchorName: navigationAnchorName } as StyleRule),
  },
});

export const navigationSelector = navigationStyles.classNames.base as unknown as 'Navigation';
export const animatedNavigationSelector = navigationStyles.classNames.variants.animated.true as unknown as 'Animated Navigation';
export const emptyNavigationSelector = navigationStyles.classNames.variants.empty.true as unknown as 'Empty Navigation';
export const navigationSectionsSelectors = Object.fromEntries(
  Object.keys(grids.mapping).map((grid) => [
    grid,
    grids.extend(grid as any, navigationSelector),
  ]),
) as unknown as {
  [Key in keyof typeof grids.mapping]:
  ReturnType<typeof grids.extend<Key, typeof navigationSelector>>
};

globalStyle(`body:has(${navigationSelector})`, {
  vars: {
    [navigationMinBlockSize]: '50px',
    [navigationMinInlineSize]: `calc(${navigationMinBlockSize} * 4 / 5)`,
    [navigationSpacing]: theme.grid.s,
  },
});

globalStyle(`${navigationSelector} li`, {
  listStyle: 'none',
});

globalStyle(`${navigationSelector}:not(${emptyNavigationSelector}):before`, {
  content: '',
  position: 'absolute',
  inset: 0,
});

const navigationBlendPercent = createVar();
const navigationBackground = createVar();
export const navigationBorderSize = createVar();
export const navigationBorderColor = createVar();
export const navigationBorderRadius = createVar();
globalStyle(`${navigationSelector} > section`, {
  display: 'inline-flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  zIndex: zIndexLayers.navigationSections,

  marginInline: navigationSpacing,
  marginBlock: navigationSpacing,

  borderStartStartRadius: navigationBorderRadius,
  borderStartEndRadius: navigationBorderRadius,
  borderEndEndRadius: navigationBorderRadius,
  borderEndStartRadius: navigationBorderRadius,

  overflow: 'hidden',
  vars: {
    [navigationBlendPercent]: '50%',
    [navigationBackground]: `color-mix(in hsl, ${theme.colors.primary.base} ${navigationBlendPercent}, ${theme.colors.background.page})`,
    [navigationBorderRadius]: '3px',
  },
});

globalStyle(`${animatedNavigationSelector} > section`, {
  background: blendAnimation(navigationBackground),

  marginInline: blendSize(navigationSpacing),
  marginBlock: blendSize(navigationSpacing),

  borderStartStartRadius: blendSize(navigationBorderRadius),
  borderStartEndRadius: blendSize(navigationBorderRadius),
  borderEndEndRadius: blendSize(navigationBorderRadius),
  borderEndStartRadius: blendSize(navigationBorderRadius),
});

globalStyle(`:where(${navigationSelector} > section > *)`, {
  paddingBlock: `calc(${navigationSpacing} * 0.75)`,
  paddingInline: `calc(${navigationSpacing} * 1.5)`,
  lineHeight: '1.2em',
  color: theme.colors.background.text,
  blockSize: '100%',
});

globalStyle(navigationSectionsSelectors.major, {
  overflow: 'visible',
});

globalStyle(`${navigationSectionsSelectors.major}:has([data-search-entrypoint]:focus-within)`, {
  zIndex: zIndexLayers.navigationSearch,
});

globalStyle(`${navigationSectionsSelectors.major} > [data-search-entrypoint]`, {
  flex: '1 1 auto',
  alignSelf: 'stretch',
  minInlineSize: '10rem',
  padding: 0,
});

globalStyle(`${navigationSelector} > section > ${themedLinkStyle.classNames.base}`, {
  color: theme.colors.background.text,
});

globalStyle(`${navigationSelector}:not(${emptyNavigationSelector}) > section`, {
  background: navigationBackground,

  borderInlineStart: `solid ${navigationBorderSize} ${navigationBorderColor}`,
  borderInlineEnd: `solid ${navigationBorderSize} ${navigationBorderColor}`,
  borderBlockStart: `solid ${navigationBorderSize} ${navigationBorderColor}`,
  borderBlockEnd: `solid ${navigationBorderSize} ${navigationBorderColor}`,

  borderBlockWidth: navigationBorderSize,
  borderInlineWidth: navigationBorderSize,

  vars: {
    [navigationBorderSize]: '2px',
    [navigationBorderColor]: theme.colors.background.elevated,
  },
});

globalStyle(`${animatedNavigationSelector}:not(${emptyNavigationSelector}) > section`, {
  borderBlockWidth: blendSize(navigationBorderSize),
  borderInlineWidth: blendSize(navigationBorderSize),
  vars: {
    [navigationBorderColor]: blendAnimation(theme.colors.background.elevated, undefined, true),
  },
});

globalStyle(navigationSectionsSelectors.settings, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minBlockSize: navigationMinBlockSize,
  minInlineSize: navigationMinBlockSize,
  marginInlineStart: 0,
});

globalStyle([
  `${navigationSectionsSelectors.settings} > button`,
  `${navigationSectionsSelectors.settings} > [role=button]`,
  `${navigationSectionsSelectors.settings} > label > [role=button]`,
].join(', '), {
  background: 'transparent',
  borderInlineStart: 'none',
  borderInlineEnd: 'none',
  borderBlockStart: 'none',
  borderBlockEnd: 'none',
  display: 'inline-grid',
  placeItems: 'center',
  cursor: 'pointer',
  color: theme.colors.background.text,
  fontSize: '1rem',
  blockSize: navigationMinBlockSize,
  inlineSize: navigationMinInlineSize,
});

globalStyle(navigationSectionsSelectors.minor, {
  marginBlockStart: 0,
  vars: {
    [navigationBlendPercent]: '30%',
  },
});

globalStyle('body', {
  vars: {
    [navigationBlockOffset]: '0px',
    [navigationRows]: '1',
  },
});

globalStyle(`body:has(${navigationSelector} ${grids.rawSelector('minor')})`, {
  vars: {
    [navigationRows]: '2',
  },
});

globalStyle(`body:has(${navigationSelector})`, {
  vars: {
    [navigationBlockOffset]: `calc(${navigationMinBlockSize} * ${navigationRows} + ${navigationSpacing} * 3)`,
  },
});

globalStyle(`body:has(${navigationSelector}${animatedNavigationSelector})`, {
  vars: {
    [navigationBlockOffset]: `calc(${blendSize(navigationMinBlockSize)} * ${navigationRows})`,
  },
});

// The navbar overlays content, so the scroller must reserve room when jumping to anchors.
globalStyle(rootPageLayoutStyles, {
  scrollPaddingBlockStart: `calc(${navigationBlockOffset} + ${theme.grid.m})`,
});

globalStyle(`body:has(${navigationSelector})`, {
  vars: {
    [navigationMobileElements]: '3',
  },
});

grids.renderer(navigationSelector);
