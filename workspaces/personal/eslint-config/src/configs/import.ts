import type { Config } from '../types.js';
import jsConfig from './js/import.js';
import tsConfig from './ts/import.js';
import { getLogger } from '../utils/debug.js';

const logger = getLogger('import');

if (tsConfig) {
  logger.log('Enabling Typescript Imports');
} else if (jsConfig) {
  logger.log('Enabling JS Imports');
} else {
  logger.log('Running without Imports');
}

const config = [...(tsConfig ?? jsConfig ?? [])] as const satisfies Config[];

export default config;
