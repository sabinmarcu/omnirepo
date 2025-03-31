import type { Extension } from '../types.js';
import { themeSelectorExtension } from './themeVariant.js';

export const extensions = [
  themeSelectorExtension,
] as const satisfies Extension[];
