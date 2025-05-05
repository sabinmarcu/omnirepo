import config from '@sabinmarcu/eslint-config';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
const eslintConfig = [
  ...config,
  {
    name: 'Root Config',
    ignores: [
      '**/dist',
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
  {
    name: 'Website ignores (thanks, nextjs)',
    files: ['**/website/**/*.tsx', '**/website/**/*.ts'],
    rules: {
      'import/extensions': ['off'],
    },
  },
];

export default eslintConfig;
