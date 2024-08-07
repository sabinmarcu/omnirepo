import {
  useMemo,
  type PropsWithChildren,
} from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import {
  ThemeContext,
  useThemeState,
} from './state.js';
import { themes } from './themes.js';

export function ThemeProvider({ children }: PropsWithChildren) {
  const state = useThemeState();
  const variant = state.theme;
  const theme = useMemo(
    () => themes[variant],
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

