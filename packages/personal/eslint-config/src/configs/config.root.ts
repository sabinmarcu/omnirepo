import type {
  Config,
} from '../types';
import { getLogger } from '../utils/debug';
import { makeConfigFactory } from '../utils/makeConfig';

getLogger('module:config').log('Loading root config files');

const config = [
  makeConfigFactory(
    './*.js',
    './*.cjs',
    './*.mjs',
    './*.ts',
  )({
    name: 'Root Configs',
    rules: {
      'global-require': 0,
      'import/no-extraneous-dependencies': 0,
      'unicorn/prefer-module': 0,
      'unicorn/no-await-expression-member': 0,
      'import/extension': 0,
    },
  }),
] satisfies Config[];

export default config;
