import type { Extension } from '../types.js';
import { themeConfigurationExtension } from './themeConfiguration.js';
import { themeSelectorExtension } from './themeVariant.js';

export const extensions = [
  themeSelectorExtension,
  themeConfigurationExtension,
] as const satisfies Extension[];
