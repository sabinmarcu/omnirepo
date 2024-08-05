import type { Config } from '../../types';
import { getLogger } from '../../utils/debug';
import { makeConfigFactory } from '../../utils/makeConfig';
import { tryImport } from '../../utils/tryImport';
import jsImportConfig from '../js/import';

const [baseImportConfig] = jsImportConfig;

const tsPlugin = await tryImport('typescript-eslint');
const reactPlugin = await tryImport('eslint-plugin-react');
const logger = getLogger('module:ts:import');

const tsxExtensions = reactPlugin ? ['.tsx'] : [];

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

if (tsPlugin) {
  logger.log('Loading Typescript Import Settings');
} else {
  logger.warn('Typescript not loaded. Skipping Typescript Import Settings');
}

const config = tsPlugin
  ? [
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
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
