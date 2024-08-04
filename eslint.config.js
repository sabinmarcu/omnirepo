import config from '@sabinmarcu/eslint-config';

const eslintConfig = [
  ...config,
  {
    name: 'Root Config',
    ignores: [
      '**/esm',
      '**/cjs',
      '**/jest.config.mjs',
    ],
  },
  {
    name: 'TSConfig Setup',
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.js',
            '.config/*/*',
          ],
        },
      },
    },
  },
  {
    name: 'Commands Override',
    files: ['**/*Command.?(m|c)ts?(x)'],
    rules: {
      'unicorn/filename-case': [
        'error',
        { case: 'pascalCase' },
      ],
    },
  },
  {
    name: 'Build System Override',
    rules: {
      'import/extensions': 'off',
    },
  },
];

export default eslintConfig;
