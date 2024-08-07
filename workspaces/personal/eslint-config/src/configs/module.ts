import type { Config } from '../types.js';
import { getLogger } from '../utils/debug.js';
import { makeConfigFactory } from '../utils/makeConfig.js';

getLogger('module:esm').log('Loading ESM rules');

const config = [
  makeConfigFactory(
    '*.mjs',
    '*.mts',
  )({
    name: 'ESM Modules Overrides',
    rules: {
      'import/extensions': [
        'error',
        'always',
      ],
    },
  }),
] satisfies Config[];

export default config;
