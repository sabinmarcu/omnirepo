import type { themes } from './themes.js';

const commonColors = {
  primary: '#0cf',
  secondary: '#f0c',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
} as const;

/**
 * Storybook's complete demo dataset. Every family owns its contextual inputs;
 * this intentionally mirrors website colors without importing website code.
 */
export const themeValues = {
  shared: {
    grid: 16,
  },
  families: {
    base: {
      colors: {
        ...commonColors,
        background: {
          light: 'oklch(72.55% 0.0551 214.8)',
          dark: 'oklch(22.12% 0.0258 215.9)',
        },
      },
    },
    red: {
      colors: {
        ...commonColors,
        primary: 'red',
        background: {
          light: 'oklch(72.55% 0.0551 214.8)',
          dark: 'oklch(22.12% 0.0258 215.9)',
        },
      },
    },
    green: {
      colors: {
        ...commonColors,
        primary: 'green',
        background: {
          light: 'oklch(72.55% 0.0551 214.8)',
          dark: 'oklch(22.12% 0.0258 215.9)',
        },
      },
    },
    blue: {
      colors: {
        ...commonColors,
        primary: 'blue',
        background: {
          light: 'oklch(72.55% 0.0551 214.8)',
          dark: 'oklch(22.12% 0.0258 215.9)',
        },
      },
    },
    personal: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.43 0.09 61.07)',
        secondary: 'oklch(0.32 0.12 8.23)',
        background: {
          light: 'oklch(76.7% 0.022 68.63)',
          dark: 'oklch(18.38% 0.0114 68.17)',
        },
      },
    },
    projects: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.83 0.3 142.6)',
        background: {
          light: 'oklch(72% 0.1029 144.6)',
          dark: 'oklch(22.46% 0.0495 143.7)',
        },
      },
    },
    articles: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.63 0.22 249.05)',
        background: {
          light: 'oklch(0.511 0.037 235.90)',
          dark: 'oklch(20.29% 0.0277 245.3)',
        },
      },
    },
    ramblings: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.63 0.33 317.55)',
        background: {
          light: 'oklch(70% 0.1044 320.6)',
          dark: 'oklch(19.34% 0.0517 320.7)',
        },
      },
    },
    snippets: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.69 0.25 39.9)',
        background: {
          light: 'oklch(72% 0.0586 42.13)',
          dark: 'oklch(20.32% 0.0305 41.79)',
        },
      },
    },
    neutral: {
      colors: {
        ...commonColors,
        primary: 'oklch(0.22 0 0)',
        secondary: 'oklch(0.98 0 0)',
        background: {
          light: 'oklch(72% 0 0)',
          dark: 'oklch(17% 0 0)',
        },
      },
    },
  },
} satisfies Parameters<typeof themes>[0];
