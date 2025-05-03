import type { Extension } from '../types.js';
import { themeConfigurationExtension } from './themeConfiguration.js';
import { themeFamilySelectorExtension } from './themeFamily.js';
import { themeSelectorExtension } from './themeVariant.js';

export const extensions = [
  themeSelectorExtension,
  themeConfigurationExtension,
  themeFamilySelectorExtension,
] as const satisfies Extension[];
