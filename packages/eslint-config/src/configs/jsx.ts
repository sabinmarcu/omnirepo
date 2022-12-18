import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.jsx',
      ],
      extends: 'airbnb',
    },
  ],
} satisfies Config;

module.exports = config;
