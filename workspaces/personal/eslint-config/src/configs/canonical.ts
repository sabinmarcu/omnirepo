import canonicalPlugin from 'eslint-plugin-canonical';
import type { Config } from '../types.js';
import { makeConfigFactory } from '../utils/makeConfig.js';
import { getLogger } from '../utils/debug.js';

getLogger('plugin:canonical').log('Loading canonical style rules');

const canonical = [
  makeConfigFactory(
    '*.ts',
    '*.tsx',
    '*.js',
    '*.cjs',
    '*.mjs',
    '*.jsx',
  )({
    plugins: {
      canonical: canonicalPlugin,
    },
    rules: {
      'canonical/destructuring-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      'canonical/export-specifier-newline': 'error',
      'canonical/import-specifier-newline': 'error',
    },

  }),
] as const satisfies Config[];

export default canonical;
