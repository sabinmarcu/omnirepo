import type { ExtensionMapping } from '../types';

export const fixPathMapping = (mapping: ExtensionMapping) => ({
  cjs: (path: string) => `${path}${mapping.cjs}`,
  esm: (path: string) => `${path}${mapping.esm}`,
});
