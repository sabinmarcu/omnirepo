import { compileConfigFor } from '../utils/compileConfig.js';

export const jsImportExtensions = [
  '.js',
  '.mjs',
  '.jsx',
] as const;

export const jsExtensions = [
  ...jsImportExtensions,
  '.cjs',
  '.json',
] as const;

export const jsConfigCompiler = compileConfigFor(
  '*.js',
  '*.cjs',
  '*.mjs',
  '*.jsx',
);
