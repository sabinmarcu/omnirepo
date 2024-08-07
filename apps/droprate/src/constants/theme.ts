import { createTheme } from '@mui/material';
import {
  AutoMode,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import type {
  Selections,
  Variants,
} from '../state/theme.js';

export const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#F0F0F0',
        paper: '#FFFFFF',
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
    },
  }),
} satisfies Record<Variants, ReturnType<typeof createTheme>>;

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
] satisfies { value: Selections, name: string, icon: typeof LightMode }[];
