import globals from 'globals';
import type {
  Config,
} from '../types';
import { makeConfigFactory } from '../utils/makeConfig';

const testExtensionGlob = '*(m|c)@(j|t)s*(x)';
const testNamingGlob = '@(spec|test)';

const config = [
  makeConfigFactory(
    'jest.*.mjs',
    'jest.*.cjs',
    'jest.*.js',
  )({
    name: 'Jest Configs',
    rules: {
      'global-require': 0,
      'import/no-extraneous-dependencies': 0,
      'unicorn/prefer-module': 0,
      'unicorn/no-await-expression-member': 0,
    },
  }),
  makeConfigFactory(
    '**/__fixtures__/**/*',
  )({
    name: 'Jest Overrides',
    rules: {
      'import/no-extraneous-dependencies': 0,
    },
  }),
  makeConfigFactory(
    `**/*.${testNamingGlob}.${testExtensionGlob}`,
    `**/__${testNamingGlob}__/**/*.${testExtensionGlob}`,
  )({
    name: 'Test Files',
    languageOptions: {
      globals: globals.jest,
    },
  }),
] satisfies Config[];

export default config;
