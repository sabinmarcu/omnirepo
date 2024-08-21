import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';
import { getLogger } from '../utils/debug.js';

getLogger('module:cjs').log('Loading CommonJS rules');

const commonjsConfig = [
  compileConfigFor(
    '*.cjs',
    '*.cts',
  )({
    name: 'CommonJS Overrides',
    rules: {
      'import/no-commonjs': 'off',
    },
  }),
] satisfies Config[];

export default commonjsConfig;
