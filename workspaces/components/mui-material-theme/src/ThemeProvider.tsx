import {
  type PropsWithChildren,
  useMemo,
} from 'react';
import { deepmerge as deepMerge } from 'deepmerge-ts';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material';
import {
  ThemeContext,
  useThemeState,
} from './state.js';
import { themes } from './themes.js';

export namespace ThemeProvider {
  export type Props = PropsWithChildren<{
    theme?: Partial<typeof themes[keyof typeof themes]>;
  }>;
}

export function ThemeProvider({
  children,
  theme: inputTheme = {},
}: ThemeProvider.Props) {
  const state = useThemeState();
  const variant = state.theme;
  const theme = useMemo(
    () => createTheme(
      deepMerge(inputTheme, themes[variant]),
    ),
    [variant],
  );
  return (
    <ThemeContext.Provider value={state}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}
