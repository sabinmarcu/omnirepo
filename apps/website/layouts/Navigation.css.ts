import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  createVar,
} from '@vanilla-extract/css';
import { zIndexLayers } from '@/constants/layers';
import { recipe } from '@vanilla-extract/recipes';

export const grids = {
  major: 'links',
  minor: 'pageLinks',
  settings: 'settings',
} as const;

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
  },
  base: {
    position: 'sticky',
    zIndex: zIndexLayers.navigation,

    insetBlockStart: 0,
    insetInline: 0,

    display: 'grid',
    gridTemplateColumns: '1fr fit-content(10rem)',
    gridTemplateAreas: [
      [grids.major, grids.settings],
      [grids.minor, grids.minor],
    ]
      .map((set) => ['"', set.join(' '), '"'].join(''))
      .join('\n'),

    fontSize: theme.grid.xxl,

    vars: {
      [navigationSpacing]: theme.grid.s,
      [navigationMinSize]: '50px',
    },
  },
});

export const navigationSelector = navigationStyles.classNames.base as unknown as 'Navigation';
export const navigationSectionsSelectors = Object.fromEntries(
  Object.entries(grids).map(([name, id]) => [
    name,
    `${navigationSelector} > section#${id}`,
  ]),
) as unknown as { [Key in keyof typeof grids]: `${typeof navigationSelector} > section#${typeof grids[Key]}` };

globalStyle(`${navigationSelector} li`, {
  listStyle: 'none',
});

globalStyle(`${navigationSelector}:not(${navigationStyles.classNames.variants.empty.true}):before`, {
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

globalStyle(`${navigationSelector} > section > *`, {
  paddingInline: navigationSpacing,
  color: theme.colors.background.text,
  inlineSize: '100%',
  blockSize: '100%',
});

globalStyle(`${navigationSelector}:not(${navigationStyles.classNames.variants.empty.true}) > section`, {
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

const assignGrid = (grid: keyof typeof grids) => {
  globalStyle(`${navigationSelector} > section#${grids[grid]}`, {
    gridArea: grids[grid],
  });
};

for (const grid of Object.keys(grids)) {
  assignGrid(grid as any);
}

