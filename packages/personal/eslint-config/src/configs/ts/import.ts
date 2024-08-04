import type { Config } from '../../types';
import { makeConfigFactory } from '../../utils/makeConfig';
import { tryImport } from '../../utils/tryImport';
import jsImportConfig from '../js/import';

const [baseImportConfig] = jsImportConfig;

const reactPlugin = await tryImport('eslint-plugin-react');

const tsxExtensions = reactPlugin ? ['*.tsx'] : [];

export const allExtensions = [
  '.ts',
  '.mts',
  '.cts',
  '.d.ts',
  ...tsxExtensions,
] as const;

export const importExtensions = [
  '.ts',
  '.mts',
  ...tsxExtensions,
] as const;

const configFiles = allExtensions.map((it) => `*${it}`) as unknown as [string];

export const makeTSConfig = makeConfigFactory(
  ...configFiles,
);

const config = [
  makeTSConfig({
    name: 'Typescript Import',
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': allExtensions,
      },
      'import/resolver': {
        node: {
          extensions: [
            ...baseImportConfig.settings['import/resolver'].node.extensions,
            ...allExtensions,
          ],
        },
      },
      'import/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import/extensions': [
        ...baseImportConfig.settings['import/extensions'],
        ...importExtensions,
      ],
    },
  }),
] as const satisfies Config[];

export default config;
