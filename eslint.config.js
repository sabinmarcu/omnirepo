import config from '@sabinmarcu/eslint-config';
import packageJson from './package.json' assert { type: 'json' };

const eslintConfig = [
  ...config,
  {
    name: 'Root Config',
    ignores: [
      '**/dist',
      '**/jest.config.mjs',
      // TODO: Remove these once the tsconfig/tsconfig.build refactor is done
      "**/src/**/*.spec.*",
      "**/src/**/__fixtures__/**/*",
      "**/src/**/__mocks__/**/*",
    ],
  },
  {
    name: "Typescript Config (for speed)",
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      }
    }
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
      'import/extensions': [
        'error',
        'always',
      ],
    },
  },
];

export default eslintConfig;
