import jsConfig from './js/js.js';
import jsxConfig from './js/jsx.js';
import type { Config } from '../types.js';

const config = [
  ...jsConfig,
  ...jsxConfig,
] as const satisfies Config[];

export default config;
