import { createThemeFamily } from '@sabinmarcu/theme/family';
import { theme as baseTheme } from '@sabinmarcu/theme/theme';

export const setupTheme = createThemeFamily(
  'personal',
  'projects',
  'articles',
  'ramblings',
  'snippets',
);

export const {
  themes,
  selector,
  variantSelector,
  selectors,
  families,
} = setupTheme;

// Background inputs are the former `#c0c0c0`/`#171717` pages pre-blended with each
// family's primary (CSS `overlay`, 50%), replacing the old full-page tint overlay.
export const themeColors = {
  base: {
    primary: '#0cf',
    secondary: '#f0c',
    background: {
      light: 'oklch(83.55% 0.0551 214.8)',
      dark: 'oklch(22.12% 0.0258 215.9)',
    },
    success: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red',
    grid: 16,
    breakpoint: {
      mobile: 700,
      tablet: 1000,
      screen: 1600,
      large: 1900,
      huge: 3800,
    },
  },
  personal: {
    primary: 'oklch(0.43 0.09 61.07)',
    secondary: 'oklch(0.32 0.12 8.23)',
    background: {
      light: 'oklch(76.7% 0.022 68.63)',
      dark: 'oklch(18.38% 0.0114 68.17)',
    },
  },
  projects: {
    primary: 'oklch(0.63 0.33 317.55)',
    background: {
      light: 'oklch(77.7% 0.1044 320.6)',
      dark: 'oklch(19.34% 0.0517 320.7)',
    },
  },
  articles: {
    primary: 'oklch(0.63 0.22 249.05)',
    background: {
      light: 'oklch(80.07% 0.0551 244.1)',
      dark: 'oklch(20.29% 0.0277 245.3)',
    },
  },
  ramblings: {
    primary: 'oklch(0.83 0.3 142.6)',
    background: {
      light: 'oklch(83.97% 0.1029 144.6)',
      dark: 'oklch(22.46% 0.0495 143.7)',
    },
  },
  snippets: {
    primary: 'oklch(0.69 0.25 39.9)',
    background: {
      light: 'oklch(79.99% 0.0586 42.13)',
      dark: 'oklch(20.32% 0.0305 41.79)',
    },
  },
} satisfies Parameters<typeof setupTheme>[0];

export const theme = {
  ...baseTheme,
} as const;
