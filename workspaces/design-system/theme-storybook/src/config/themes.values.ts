import type { themes } from './themes.js';

export const themeValues = {
  base: {
    primary: '#0cf',
    secondary: '#f0c',
    background: {
      light: '#e0e0e0',
      dark: '#202020',
    },
    success: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red',
    grid: 16,
  },
  red: {
    primary: 'red',
  },
  green: {
    primary: 'green',
  },
  blue: {
    primary: 'blue',
  },
} satisfies Parameters<typeof themes>[0];
