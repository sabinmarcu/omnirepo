import {
  jsExtensions,
  jsImportExtensions,
} from '../constants/js.js';
import type { Config } from '../types.js';
import { getLogger } from '../utils/debug.js';
import { legacyPlugin } from '../utils/legacyPlugin.js';

getLogger('import:js').log('Loading JS Import settings');

const jsImportConfig = [
  {
    name: 'JS Import',
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import') as any,
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
      'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
    },
  },
] as const satisfies Config[];

export default jsImportConfig;
