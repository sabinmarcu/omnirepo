import unicornPlugin from 'eslint-plugin-unicorn';
import type {
  Config,
} from '../types';

import { makeConfigFactory } from '../utils/makeConfig';

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
      'unicorn/no-useless-undefined': 0,
      'unicorn/no-array-callback-reference': 0,
      'unicorn/no-array-reduce': 0,
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
