import type { Extension } from '../types.js';
import { themeConfigExtension } from './themeConfiguration.js';
import { themeFamilySelectorExtension } from './themeFamily.js';
import { themeSelectorExtension } from './themeVariant.js';

export const extensions = [
  themeSelectorExtension,
  themeConfigExtension,
  themeFamilySelectorExtension,
] as const satisfies Extension[];
