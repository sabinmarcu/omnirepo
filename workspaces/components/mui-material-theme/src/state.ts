import { useLocalStorage } from '@sabinmarcu/use-local-storage';
import { useMatchMedia } from '@sabinmarcu/use-match-media';
import {
  createContext,
  useContext,
  useMemo,
} from 'react';
import type {
  Selections,
  Variants,
} from './types.js';

export const useThemeState = () => {
  const [
    selection,
    setSelection,
  ] = useLocalStorage<Selections>('theme', 'system');
  const prefersDarkColorScheme = useMatchMedia([
    'prefers-color-scheme',
    'dark',
  ]);
  const theme = useMemo(
    () => {
      if (selection === 'system') {
        if (prefersDarkColorScheme) {
          return 'dark';
        }
        return 'light';
      }
      return selection;
    },
    [
      selection,
      prefersDarkColorScheme,
    ],
  );
  return {
    selection,
    theme,
    setSelection,
  } as const;
};

const throwIfNotProvided = () => {
  throw new Error('Must use the ThemeProvider!');
};
export const ThemeContext = createContext<ReturnType<typeof useThemeState>>({
  get selection() { return throwIfNotProvided() as Selections; },
  get theme() { return throwIfNotProvided() as Variants; },
  setSelection: throwIfNotProvided,
});

export const useThemeSelection = () => {
  const {
    selection,
    setSelection,
  } = useContext(ThemeContext);
  return [
    selection,
    setSelection,
  ] as const;
};

export const useTheme = () => useContext(ThemeContext).theme;
