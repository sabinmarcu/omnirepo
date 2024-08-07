import type { Config } from '../../types.js';
import { getLogger } from '../../utils/debug.js';
import { tryImport } from '../../utils/tryImport.js';
import { makeTSConfig } from './import.js';

const tsPlugin = await tryImport('typescript-eslint');

const logger = getLogger('module:ts:reset');

if (tsPlugin) {
  logger.log('Loading Typescript Resets');
} else {
  logger.warn('Skipping Typescript Reset Rules');
}

const config = tsPlugin
  ? [
    makeTSConfig({
      name: 'Typescript Reset',
      rules: {
        'constructor-super': 'off',
        'getter-return': 'off',
        'no-const-assign': 'off',
        'no-dupe-args': 'off',
        'no-dupe-class-members': 'off',
        'no-dupe-keys': 'off',
        'no-func-assign': 'off',
        'no-import-assign': 'off',
        'no-new-symbol': 'off',
        'no-obj-calls': 'off',
        'no-redeclare': 'off',
        'no-setter-return': 'off',
        'no-this-before-super': 'off',
        'no-undef': 'off',
        'no-unreachable': 'off',
        'no-unsafe-negation': 'off',
        'valid-typeof': 'off',
        'import/named': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'off',
      },
    }),
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
