import tsConfig from './ts/ts.js';
import tsxConfig from './ts/tsx.js';
import resetConfig from './ts/reset.js';
import type { Config } from '../types.js';

const config = [
  ...resetConfig,
  ...tsConfig,
  ...tsxConfig,
] as const satisfies Config[];

export default config;
