import type { ExtensionMapping } from '../types.js';

export const fixPathMapping = (mapping: ExtensionMapping) => ({
  cjs: (path: string) => `${path}${mapping.cjs}`,
  esm: (path: string) => `${path}${mapping.esm}`,
  dts: (path: string) => `${path}${mapping.dts}`,
});
