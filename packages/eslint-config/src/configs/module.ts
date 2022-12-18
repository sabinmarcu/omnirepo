import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.mjs',
        '*.mts',
      ],
      rules: {
        'import/extensions': [
          'error',
          'always',
        ],
      },
    },
  ],
} satisfies Config;

module.exports = config;
