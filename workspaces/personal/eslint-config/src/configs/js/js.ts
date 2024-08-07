import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import type {
  Config,
} from '../../types.js';
import rules from './js-rules/index.js';
import { makeConfigFactory } from '../../utils/makeConfig.js';
import { getLogger } from '../../utils/debug.js';

getLogger('module:js').log('Loading base JS rules');

const config = [
  makeConfigFactory(
    '*.js',
    '*.mjs',
    '*.cjs',
    '*.jsx',
  )({
    name: 'JS Config',
    plugins: {
      '@stylistic/js': stylisticJsPlugin as any,
    },
    rules,
  }),
] satisfies Config[];

export default config;
