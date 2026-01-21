import {
  setupTheme,
  ThemeMetadataSymbol,
} from './contracts/theme.js';

export const { finalContract: theme } = setupTheme[ThemeMetadataSymbol];
