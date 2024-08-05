import type { Config } from '../types';
import { getLogger } from '../utils/debug';
import { makeConfigFactory } from '../utils/makeConfig';

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
