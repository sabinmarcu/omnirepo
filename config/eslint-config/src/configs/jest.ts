import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        'jest.*.mjs',
        'jest.*.cjs',
        'jest.*.js',
      ],
      rules: {
        'global-require': 0,
        'import/no-extraneous-dependencies': 0,
        'unicorn/prefer-module': 0,
        'unicorn/no-await-expression-member': 0,
      },
    },
    {
      files: [
        '**/__fixtures__/**/*',
      ],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
} satisfies Config;

module.exports = config;
