import type { Config } from '../types';

import sharedConfig from './parser/shared';
import babelConfig from './parser/babel';
import tsConfig from './parser/typescript';

const config = [
  ...sharedConfig,
  ...(tsConfig ?? babelConfig ?? []),
] as const satisfies Config[];

export default config;
