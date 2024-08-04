import type { Config } from '../../types';
import { legacyPlugin } from '../../utils/legacyPlugin';

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
      },
      'import/extensions': [
        '.js',
        '.mjs',
        '.jsx',
      ],
      'import/core-modules': [],
      'import/ignore': [
        'node_modules',
        String.raw`\.(coffee|scss|css|less|hbs|svg|json)$`,
      ],
    },
  },
] as const satisfies Config[];

export default config;
