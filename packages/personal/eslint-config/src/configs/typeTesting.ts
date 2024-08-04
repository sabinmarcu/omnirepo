import type {
  Config,
} from '../types';
import { makeConfigFactory } from '../utils/makeConfig';
import { tryImport } from '../utils/tryImport';

const expectTypePlugin = await tryImport('eslint-plugin-expect-type');

if (!expectTypePlugin) {
  console.warn('Expect Type plugin not found. Skipping type unit testing.');
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
