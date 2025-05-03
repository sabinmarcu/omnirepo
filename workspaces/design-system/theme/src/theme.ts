import {
  setupTheme,
  ThemeMetadataSymbol,
} from './contracts/theme.js';

export const { contract: theme } = setupTheme[ThemeMetadataSymbol];
