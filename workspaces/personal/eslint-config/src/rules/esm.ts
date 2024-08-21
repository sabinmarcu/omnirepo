import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';
import { getLogger } from '../utils/debug.js';

getLogger('module:esm').log('Loading ESM rules');

const esmConfig = [
  compileConfigFor(
    '*.mjs',
    '*.mts',
  )({
    name: 'ESM Modules Overrides',
    rules: {
      'import/extensions': ['error', 'always'],
    },
  }),
] satisfies Config[];

export default esmConfig;
