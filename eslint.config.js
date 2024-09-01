import config from '@sabinmarcu/eslint-config';

const eslintConfig = [
  ...config,
  {
    name: 'Root Config',
    ignores: [
      '**/dist',
      '**/jest.config.mjs',
    ],
  },
  {
    name: 'Commands Override',
    files: ['**/*Command.?(m|c)ts?(x)'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  },
  {
    files: ['**/timer40k/**/*.tsx'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
];

export default eslintConfig;
