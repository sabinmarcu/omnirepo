import type {
  Config,
} from '../types.js';
import { getLogger } from '../utils/debug.js';
import { compileConfigFor } from '../utils/compileConfig.js';

getLogger('module:vitest').log('Loading Vitest Rules');

const vitestConfig = [
  compileConfigFor(
    'vitest.*.mjs',
    'vitest.*.cjs',
    'vitest.*.js',
    'vitest.*.ts',
  )({
    name: 'vitest Configs',
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
    name: 'vitest Overrides',
    rules: {
      'import/no-extraneous-dependencies': 0,
    },
  }),
] satisfies Config[];

export default vitestConfig;
