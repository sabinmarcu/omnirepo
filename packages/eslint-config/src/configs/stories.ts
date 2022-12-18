import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      extends: ['plugin:storybook/recommended'],
      rules: {
        'no-underscore-dangle': 'off',
      },
    },
    {
      files: ['*.stories.@(ts|tsx)'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ],
} satisfies Config;

module.exports = config;
