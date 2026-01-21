import { createThemeFamily } from '@sabinmarcu/theme/family';
import { theme as baseTheme } from '@sabinmarcu/theme';

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

export const themeColors = {
  base: {
    primary: '#0cf',
    secondary: '#f0c',
    background: {
      light: '#e0e0e0',
      dark: '#171717',
    },
    success: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red',
    grid: 16,
    breakpoint: {
      mobile: 700,
      tablet: 1000,
      screen: 1200,
      large: 1980,
      huge: 3000,
    },
  },
  personal: {
    primary: 'oklch(0.43 0.09 61.07)',
    secondary: 'oklch(0.39 0.11 4.26)',
  },
  projects: {
    primary: 'oklch(0.63 0.33 317.55)',
  },
  articles: {
    primary: 'oklch(0.63 0.22 249.05)',
  },
  ramblings: {
    primary: 'oklch(0.83 0.3 142.6)',
  },
  snippets: {
    primary: 'oklch(0.69 0.25 39.9)',
  },
} satisfies Parameters<typeof setupTheme>[0];

export const theme = {
  ...baseTheme,
} as const;
