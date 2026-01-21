import { themeVariants } from '@sabinmarcu/theme/constants';

export const themeSelections = [...themeVariants, 'system'] as const;
export const themeSelectionsMap = {
  system: 'System Determined',
  dark: 'Dark',
  light: 'Light',
} satisfies Record<typeof themeSelections[number], string>;
export type ThemeSelection = keyof typeof themeSelectionsMap;

export const getNextSelection = (selection: ThemeSelection) => {
  const currentIndex = themeSelections.indexOf(selection);
  const nextIndex = currentIndex >= themeSelections.length - 1
    ? 0
    : currentIndex + 1;
  return themeSelections[nextIndex];
};

