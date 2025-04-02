import unicornPlugin from 'eslint-plugin-unicorn';
import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';

export const unicornRules = {
  ...unicornPlugin.configs.recommended.rules,
  'unicorn/filename-case': 'off',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-negated-condition': 'off',
  'unicorn/prefer-string-raw': 'off',
  'unicorn/no-null': 'off',
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
      checkFilenames: false,
    },
  ],
} as const satisfies Config['rules'];

const unicornRulesConfig = [
  {
    name: 'Unicorn Rules',
    rules: unicornRules,
  },
  compileConfigFor('*.cjs', '*.cts')({
    name: 'Unicorn CJS Rules',
    rules: {
      'unicorn/prefer-module': 'off',
    },
  }),
] as const satisfies Config[];

export default unicornRulesConfig;
