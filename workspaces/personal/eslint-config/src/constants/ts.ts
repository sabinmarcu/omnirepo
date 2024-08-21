import { compileConfigFor } from '../utils/compileConfig.js';
import {
  jsExtensions,
  jsImportExtensions,
} from './js.js';

const tsESMExtensions = [
  '.ts',
  '.mts',
  '.tsx',
] as const;

const tsCJSExtensions = ['.cts'] as const;

const tsExclusiveExtensions = [...tsESMExtensions, ...tsCJSExtensions];

export const tsImportExtensions = [...jsImportExtensions, ...tsESMExtensions] as const;

export const tsExtensions = [
  ...tsImportExtensions,
  ...tsCJSExtensions,
  '.d.ts',
] as const;

export const allExtensions = [...jsExtensions, ...tsExtensions]
  .filter((it, index, array) => array.indexOf(it) === index);

const configFiles = tsExclusiveExtensions
  .map((it) => `*${it}`) as unknown as [string];

export const tsConfigCompiler = compileConfigFor(
  ...configFiles,
);
