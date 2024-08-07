import type { Config } from '../../types.js';
import { getLogger } from '../../utils/debug.js';
import { legacyPlugin } from '../../utils/legacyPlugin.js';

getLogger('module:js:import').log('Loading JS Import settings');

export const jsImportExtensions = [
  '.js',
  '.mjs',
  '.jsx',
];

export const jsExtensions = [
  ...jsImportExtensions,
  '.cjs',
  '.json',
];

const config = [
  {
    name: 'JS Import',
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: jsExtensions,
        },
        exports: true,
      },
      'import/extensions': jsImportExtensions,
      'import/core-modules': [],
      'import/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
  },
] as const satisfies Config[];

export default config;
