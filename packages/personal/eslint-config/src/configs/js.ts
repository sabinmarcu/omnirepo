import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.js',
        '*.mjs',
        '*.cjs',
      ],
      extends: 'airbnb-base',

      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            '@babel/plugin-syntax-import-assertions',
          ],
        },
      },
    },
  ],
} satisfies Config;

module.exports = config;
