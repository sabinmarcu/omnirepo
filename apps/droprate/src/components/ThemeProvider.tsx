import { useAtom } from 'jotai';
import {
  useMemo,
  type PropsWithChildren,
} from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { themeAtom } from '../state/theme.js';
import { themes } from '../constants/theme.js';

export function ThemeProvider({ children }: PropsWithChildren) {
  const [variant] = useAtom(themeAtom);
  const theme = useMemo(
    () => themes[variant],
    [variant],
  );
  return (
    <MUIThemeProvider theme={theme}>
      {children}
    </MUIThemeProvider>
  );
}
