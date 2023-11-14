import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
        '*.js',
        '*.cjs',
        '*.mjs',
        '*.jsx',
      ],
      plugins: [
        'modules-newlines',
      ],
      settings: {
        'import/resolver': {
          node: {
            extensions: [
              '.mjs',
              '.cjs',
              '.js',
              '.jsx',
              '.json',
              '.mts',
              '.cts',
              '.ts',
              '.tsx',
              '.d.ts',
            ],
          },
        },
      },
      rules: {
        // Newlines
        'modules-newlines/import-declaration-newline': 'error',
        'modules-newlines/export-declaration-newline': 'error',

        // Overrides for Airbnb
        'import/prefer-default-export': 0,
        'react/react-in-jsx-scope': 0,
        'react/prop-types': 0,
        'react/require-default-props': 0,
        'react/jsx-props-no-spreading': 0,
        'no-restricted-syntax': 0,

        // Overrides for unicorn
        'unicorn/filename-case': ['error', { case: 'camelCase' }],
        'unicorn/no-useless-undefined': 0,
        'unicorn/no-array-callback-reference': 0,
      },
    },
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      rules: {
        '@typescript-eslint/indent': [
          'error',
          2,
          {
            ignoredNodes: [
              'TSTypeParameterInstantiation',
            ],
          },
        ],
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
          },
        ],
      },
    },
  ],
} satisfies Config;

module.exports = config;
