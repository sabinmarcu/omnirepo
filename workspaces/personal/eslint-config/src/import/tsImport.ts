import { tsImportExtensions } from '../constants/ts.js';
import type { Config } from '../types.js';
import { getLogger } from '../utils/debug.js';
import jsImportConfig from './jsImport.js';

const [baseImportConfig] = jsImportConfig;

getLogger('import:js').log('Loading JS Import settings');
const {
  name,
  ...baseConfig
} = baseImportConfig;

const tsImportConfig = [
  {
    name: 'Typescript Import',
    ...baseConfig,
    settings: {
      'import/resolver': {
        exports: true,
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/extensions': tsImportExtensions,
      'import/parsers': {
        '@typescript-eslint/parser': [
          '.ts',
          '.tsx',
          '.mts',
          '.cts',
        ],
      },
    },
  },
] as const satisfies Config[];

export default tsImportConfig;
