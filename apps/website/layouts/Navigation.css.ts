import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  createVar,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';
import { recipe } from '@vanilla-extract/recipes';
import { grids } from './Navigation.grid';
import {
  blendAnimation,
  blendSize,
  navigationAnimation,
  navigationAnimationPercent,
} from './Navigation.animation.css';
import { rootScrollTimeline } from './RootPageLayout.css';

export const navigationSpacing = createVar();
export const navigationMinSize = createVar();
export const navigationStyles = recipe({
  variants: {
    empty: {
      true: {
        position: 'fixed',
        insetBlockStart: 0,
        insetInline: 0,
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

    fontSize: theme.grid.xxl,
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
    [navigationMinSize]: '50px',
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
  background: `linear-gradient(to bottom, ${theme.colors.background.page} 90%, transparent 100%)`,
});

const navigationBlendPercent = createVar();
const navigationBackground = createVar();
const navigationBorderSize = createVar();
const navigationBorderColor = createVar();
export const navigationBorderRadius = createVar();
globalStyle(`${navigationSelector} > section`, {
  display: 'inline-flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
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
    [navigationBorderRadius]: theme.grid.xxs,
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

globalStyle(`${navigationSelector} > section > *`, {
  paddingInline: navigationSpacing,
  color: theme.colors.background.text,
  inlineSize: '100%',
  blockSize: '100%',
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
    [navigationBorderColor]: `${blendAnimation(theme.colors.background.elevated, undefined, true)}`,
  },
});

globalStyle(`${navigationSectionsSelectors.settings}`, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minBlockSize: navigationMinSize,
  minInlineSize: navigationMinSize,
  marginInlineStart: 0,
});

globalStyle([
  'button',
  '[role=button]',
].map((selector) => `${navigationSectionsSelectors.settings} ${selector}`).join(', '), {
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
});

globalStyle(`${navigationSectionsSelectors.minor}`, {
  marginBlockStart: 0,
  vars: {
    [navigationBlendPercent]: '30%',
  },
});

grids.renderer(navigationSelector);
