import unicornPlugin from 'eslint-plugin-unicorn';
import type {
  Config,
} from '../types';

import { makeConfigFactory } from '../utils/makeConfig';
import { getLogger } from '../utils/debug';

getLogger('plugin:unicorn').log('Loading Plugin and Rules');

const config = [
  {
    name: 'Unicorn Config',
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      ...unicornPlugin.configs.recommended.rules,
      'unicorn/filename-case': [
        'error',
        { case: 'camelCase' },
      ],
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-string-raw': 'off',
    },
  },
  makeConfigFactory('*.jsx', '*.tsx')({
    name: 'Unicorn JSX Overrides',
    rules: {
      'unicorn/filename-case': [
        'error',
        { case: 'pascalCase' },
      ],
    },
  }),
] satisfies Config[];

export default config;
