import unicornPlugin from 'eslint-plugin-unicorn';
import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';

export const unicornRules = {
  ...unicornPlugin.configs.recommended.rules,
  'unicorn/filename-case': ['error', { case: 'camelCase' }],
  'unicorn/no-useless-undefined': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-negated-condition': 'off',
  'unicorn/prefer-string-raw': 'off',
  'unicorn/prevent-abbreviations': [
    'error',
    {
      replacements: {
        e: { event: true },
        err: { error: true },
        env: false,
        param: false,
        params: false,
        prop: false,
        props: false,
      },
    },
  ],
} as const satisfies Config['rules'];

const unicornRulesConfig = [
  {
    name: 'Unicorn Rules',
    rules: unicornRules,
  },
  compileConfigFor('*.jsx', '*.tsx')({
    name: 'Unicorn JSX Rules',
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  }),
  compileConfigFor('*.cjs', '*.cts')({
    name: 'Unicorn CJS Rules',
    rules: {
      'unicorn/prefer-module': 'off',
    },
  }),
] as const satisfies Config[];

export default unicornRulesConfig;
