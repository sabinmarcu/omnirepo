import type { Config } from '../types.js';
import { compileConfigFor } from './compileConfig.js';

const configFilesExtensions = [
  '*.js',
  '*.cjs',
  '*.mjs',
  '*.ts',
];
export const compileConfigFilesConfigFor = (
  configs: Config,
) => (
  ...paths: [string, ...string[]]
) => {
  const files = paths.flatMap((path) => (
    configFilesExtensions.map((extension) => `${path.replace(/\/$/, '')}${extension}`)
  )) as [string, ...string[]];

  return compileConfigFor(...files)(configs);
};
