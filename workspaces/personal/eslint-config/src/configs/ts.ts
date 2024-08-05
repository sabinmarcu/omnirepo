import tsConfig from './ts/ts';
import tsxConfig from './ts/tsx';
import tsImportConfig from './ts/import';
import resetConfig from './ts/reset';
import type { Config } from '../types';

const config = [
  ...resetConfig,
  ...tsConfig,
  ...tsxConfig,
  ...tsImportConfig,
] as const satisfies Config[];

export default config;
