import type { Config } from '../types';
import { makeConfigFactory } from '../utils/makeConfig';

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
