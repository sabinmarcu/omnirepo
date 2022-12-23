import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.tsx',
      ],
      extends: [
        'airbnb',
        'airbnb-typescript',
      ],
    },
  ],
} satisfies Config;

module.exports = config;
