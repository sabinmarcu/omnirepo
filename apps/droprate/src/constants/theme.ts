import { createTheme } from '@mui/material';
import {
  AutoMode,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import type {
  Selections,
  Variants,
} from '../state/theme';

export const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
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
