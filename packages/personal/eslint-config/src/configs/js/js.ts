import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import type {
  Config,
} from '../../types';

import rules from './js-rules/index';
import { makeConfigFactory } from '../../utils/makeConfig';
import { getLogger } from '../../utils/debug';

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
      '@stylistic/js': stylisticJsPlugin,
    },
    rules,
  }),
] satisfies Config[];

export default config;
