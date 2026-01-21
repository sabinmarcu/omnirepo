import { themeVariants } from '@sabinmarcu/theme/constants';

export const themeSelections = [...themeVariants, 'system'] as const;
export const themeSelectionsMap = {
  system: 'System Determined',
  dark: 'Dark',
  light: 'Light',
} satisfies Record<typeof themeSelections[number], string>;
export type ThemeSelection = keyof typeof themeSelectionsMap;

export const isThemeSelection = (input: any): input is ThemeSelection => (
  themeSelections.includes(input)
);

export const cookieName = 'theme-variant';