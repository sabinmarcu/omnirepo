import type { Config } from '../../types';
import { getLogger } from '../../utils/debug';
import { legacyPlugin } from '../../utils/legacyPlugin';

getLogger('module:js:import').log('Loading JS Import settings');

const config = [
  {
    name: 'JS Import',
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: [
            '.mjs',
            '.cjs',
            '.js',
            '.jsx',
            '.json',
          ],
        },
        exports: true,
      },
      'import/extensions': [
        '.js',
        '.mjs',
        '.jsx',
      ],
      'import/core-modules': [],
      'import/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
  },
] as const satisfies Config[];

export default config;
