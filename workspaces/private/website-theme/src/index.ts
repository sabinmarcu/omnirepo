import {
  themeDataAttribute,
  themeDefinition as concreteThemeDefinition,
  themeContractLayer,
  themeFamilyDataAttribute,
  themeValuesLayer,
  themeVariantsLayer,
} from '@sabinmarcu/theme';
import {
  breakpointGenerator,
  extendTheme,
} from '@sabinmarcu/theme-core';
import { createThemeFamily } from '@sabinmarcu/theme-family';

export const themeDefinition = extendTheme(concreteThemeDefinition, {
  breakpoint: breakpointGenerator([
    ['mobile', 700],
    ['tablet', 1000],
    ['screen', 1600],
    ['large', 1900],
    ['huge', 3800],
  ]),
});

export const theme = themeDefinition.contract;

const websiteFamilies = [
  'personal',
  'projects',
  'articles',
  'ramblings',
  'snippets',
  'neutral',
] as const;

export function createWebsiteTheme(options: { readonly nonce?: string } = {}) {
  return createThemeFamily(themeDefinition, {
    id: 'website',
    families: websiteFamilies,
    nonce: options.nonce,
    layer: themeValuesLayer,
    mappingLayer: themeContractLayer,
    variantLayer: themeVariantsLayer,
  });
}

export const themeValues = {
  shared: {
    grid: 16,
  },
  families: {
    base: {
      colors: {
        primary: '#0cf',
        secondary: '#f0c',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(72.55% 0.0551 214.8)',
          dark: 'oklch(22.12% 0.0258 215.9)',
        },
      },
    },
    personal: {
      colors: {
        primary: 'oklch(0.43 0.09 61.07)',
        secondary: 'oklch(0.32 0.12 8.23)',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(76.7% 0.022 68.63)',
          dark: 'oklch(18.38% 0.0114 68.17)',
        },
      },
    },
    projects: {
      colors: {
        primary: 'oklch(0.83 0.3 142.6)',
        secondary: '#f0c',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(72% 0.1029 144.6)',
          dark: 'oklch(22.46% 0.0495 143.7)',
        },
      },
    },
    articles: {
      colors: {
        primary: 'oklch(0.63 0.22 249.05)',
        secondary: '#f0c',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(0.511 0.037 235.90)',
          dark: 'oklch(20.29% 0.0277 245.3)',
        },
      },
    },
    ramblings: {
      colors: {
        primary: 'oklch(0.63 0.33 317.55)',
        secondary: '#f0c',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(70% 0.1044 320.6)',
          dark: 'oklch(19.34% 0.0517 320.7)',
        },
      },
    },
    snippets: {
      colors: {
        primary: 'oklch(0.69 0.25 39.9)',
        secondary: '#f0c',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(72% 0.0586 42.13)',
          dark: 'oklch(20.32% 0.0305 41.79)',
        },
      },
    },
    neutral: {
      colors: {
        primary: 'oklch(0.22 0 0)',
        secondary: 'oklch(0.98 0 0)',
        info: 'blue',
        success: 'green',
        warning: 'yellow',
        error: 'red',
        background: {
          light: 'oklch(72% 0 0)',
          dark: 'oklch(17% 0 0)',
        },
      },
    },
  },
} satisfies Parameters<ReturnType<typeof createWebsiteTheme>>[0];

// The views are token metadata for Vanilla Extract consumers. They do not initialize values.
const metadata = createWebsiteTheme();

export const { families } = metadata;
export const { themes } = metadata;
export const { selectors } = metadata;
export const selector = `data-${themeFamilyDataAttribute}`;
export const variantSelector = `data-${themeDataAttribute}`;
