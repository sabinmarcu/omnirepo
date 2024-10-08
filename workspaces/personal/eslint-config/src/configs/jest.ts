import globals from 'globals';
import type {
  Config,
} from '../types.js';
import { getLogger } from '../utils/debug.js';
import { compileConfigFor } from '../utils/compileConfig.js';

const testExtensionGlob = '*(m|c)@(j|t)s*(x)';
const testNamingGlob = '@(spec|test)';

getLogger('module:jest').log('Loading Jest Rules');

const jestConfig = [
  compileConfigFor(
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
  compileConfigFor(
    '**/__fixtures__/**/*',
  )({
    name: 'Jest Overrides',
    rules: {
      'import/no-extraneous-dependencies': 0,
    },
  }),
  compileConfigFor(
    `**/*.${testNamingGlob}.${testExtensionGlob}`,
    `**/*.${testNamingGlob}.*.${testExtensionGlob}`,
    `**/__${testNamingGlob}__/**/*.${testExtensionGlob}`,
  )({
    name: 'Test Files',
    languageOptions: {
      globals: globals.jest,
    },
  }),
] satisfies Config[];

export default jestConfig;
