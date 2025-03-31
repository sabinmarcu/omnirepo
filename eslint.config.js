import config from '@sabinmarcu/eslint-config';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
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
  // {
  //   name: 'Typescript TSConfig',
  //   languageOptions: {
  //     parserOptions: {
  //       projectService: false,
  //       project: './tsconfig.eslint.json',
  //     },
  //   },
  //
  // },
  {
    files: ['**/timer40k/**/*.tsx'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
];

export default eslintConfig;
