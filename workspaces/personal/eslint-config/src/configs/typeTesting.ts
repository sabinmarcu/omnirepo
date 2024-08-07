import type {
  Config,
} from '../types.js';
import { getLogger } from '../utils/debug.js';
import { makeConfigFactory } from '../utils/makeConfig.js';
import { tryImport } from '../utils/tryImport.js';

const logger = getLogger('plugin:expect-type');
const expectTypePlugin = await tryImport('eslint-plugin-expect-type');

if (expectTypePlugin) {
  logger.log('Loading Type Testing (expect-type)');
} else {
  logger.warn('Expect Type plugin not found. Skipping');
}

const config = expectTypePlugin
  ? [
    makeConfigFactory(
      '*.type.spec.ts',
      '*.type.spec.tsx',

    )({
      name: 'Expect Type Config (type unit testing)',
      plugins: {
        'expect-type': expectTypePlugin,
      },
      rules: {
        ...expectTypePlugin.configs.recommended.rules,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-unused-expressions': 0,
        '@typescript-eslint/naming-convention': 0,
        'max-len': 0,
        'no-lone-blocks': 0,
      },
    }),
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
