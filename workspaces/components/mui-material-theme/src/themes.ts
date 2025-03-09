import type { createTheme } from '@mui/material';
import {
  AutoMode,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import type {
  Selections,
  Variants,
} from './types.js';

export const themes = {
  light: {
    palette: {
      mode: 'light',
      background: {
        default: '#F0F0F0',
        paper: '#FFFFFF',
      },
    },
  },
  dark: {
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
    },
  },
} as const satisfies Record<Variants, Parameters<typeof createTheme>[0]>;

export const selections = [
  {
    value: 'light',
    name: 'Light Theme',
    icon: LightMode,
  },
  {
    value: 'dark',
    name: 'Dark Theme',
    icon: DarkMode,
  },
  {
    value: 'system',
    name: 'System Determined',
    icon: AutoMode,
  },
] as const satisfies {
  value: Selections;
  name: string;
  icon: typeof LightMode;
}[];
