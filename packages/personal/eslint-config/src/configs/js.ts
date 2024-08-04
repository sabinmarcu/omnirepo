import jsConfig from './js/js';
import jsxConfig from './js/jsx';
import jsImportConfig from './js/import';
import type { Config } from '../types';

const config = [
  ...jsImportConfig,
  ...jsConfig,
  ...jsxConfig,
] as const satisfies Config[];

export default config;
