import type { Config } from '../types';

import sharedConfig from './parser/shared';
import babelConfig from './parser/babel';
import tsConfig from './parser/typescript';
import { getLogger } from '../utils/debug';

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
