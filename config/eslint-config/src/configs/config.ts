import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        './*.js',
        './*.ts',
      ],
      rules: {
        'global-require': 0,
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
} satisfies Config;

module.exports = config;
