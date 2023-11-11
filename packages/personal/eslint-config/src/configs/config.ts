import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        './*.js',
        './*.cjs',
        './*.mjs',
        './*.ts',
      ],
      rules: {
        'global-require': 0,
        'import/no-extraneous-dependencies': 0,
        'unicorn/prefer-module': 0,
        'unicorn/no-await-expression-member': 0,
        'import/extension': 0,
      },
    },
  ],
} satisfies Config;

module.exports = config;
