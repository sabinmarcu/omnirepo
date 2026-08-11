import unicornPlugin from 'eslint-plugin-unicorn';
import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';

export const unicornRules = {
  ...unicornPlugin.configs.unopinionated.rules,
  'unicorn/catch-error-name': 'error',
  'unicorn/consistent-assert': 'error',
  'unicorn/consistent-empty-array-spread': 'error',
  'unicorn/consistent-function-scoping': 'error',
  'unicorn/empty-brace-spaces': 'error',
  'unicorn/explicit-length-check': 'error',
  'unicorn/logical-assignment-operators': ['error', 'always'],
  'unicorn/no-for-loop': 'error',
  'unicorn/no-nested-ternary': 'error',
  'unicorn/no-top-level-side-effects': 'off',
  'unicorn/prefer-export-from': 'error',
  'unicorn/prefer-query-selector': 'error',
  'unicorn/prefer-spread': 'error',
  'unicorn/switch-case-braces': 'error',
  'unicorn/template-indent': 'error',
  'unicorn/filename-case': 'off',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-negated-condition': 'off',
  'unicorn/prefer-string-raw': 'off',
  'unicorn/no-null': 'off',
  'unicorn/name-replacements': [
    'error',
    {
      replacements: {
        arg: false,
        args: false,
        e: { event: true },
        dep: false,
        docs: false,
        err: { error: true },
        env: false,
        ident: false,
        obj: false,
        param: false,
        params: false,
        prop: false,
        props: false,
        var: false,
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
