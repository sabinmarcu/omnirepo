import type { Config } from '../types.js';
import sharedConfig from './parser/shared.js';
import babelConfig from './parser/babel.js';
import tsConfig from './parser/typescript.js';
import { getLogger } from '../utils/debug.js';

const logger = getLogger('parser');

if (tsConfig) {
  logger.log('Enabling Typescript Parser');
} else if (babelConfig) {
  logger.log('Enabling Bable Parser (shouldn\'t need this)');
} else {
  logger.log('Running without Parser');
}

const config = [
  ...sharedConfig,
  ...(tsConfig ?? babelConfig ?? []),
] as const satisfies Config[];

export default config;
