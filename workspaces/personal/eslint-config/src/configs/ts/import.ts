import type { Config } from '../../types.js';
import { getLogger } from '../../utils/debug.js';
import { makeConfigFactory } from '../../utils/makeConfig.js';
import { tryImport } from '../../utils/tryImport.js';
import jsImportConfig, {
  jsExtensions,
  jsImportExtensions,
} from '../js/import.js';

const [baseImportConfig] = jsImportConfig;

const tsPlugin = await tryImport('typescript-eslint');
const reactPlugin = await tryImport('eslint-plugin-react');
const logger = getLogger('module:ts:import');

const tsxExtensions = reactPlugin ? ['.tsx'] : [];

export const tsImportExtensions = [
  ...jsImportExtensions,
  '.ts',
  '.mts',
  ...tsxExtensions,
] as const;

export const tsExtensions = [
  ...tsImportExtensions,
  '.cts',
  '.d.ts',
  ...tsxExtensions,
] as const;

export const allExtensions = [
  ...jsExtensions,
  ...tsExtensions,
].filter((it, index, array) => array.indexOf(it) === index);

const configFiles = allExtensions
  .filter((it) => !it.includes('.json'))
  .map((it) => `*${it}`) as unknown as [string];

export const makeTSConfig = makeConfigFactory(
  ...configFiles,
);

if (tsPlugin) {
  logger.log('Loading Typescript Import Settings');
} else {
  logger.warn('Typescript not loaded. Skipping Typescript Import Settings');
}

const {
  name,
  ...baseConfig
} = baseImportConfig;

const config = tsPlugin
  ? [
    makeTSConfig({
      name: 'Typescript Import',
      ...baseConfig,
      settings: {
        ...baseConfig.settings,
        'import/resolver': {
          exports: true,
          typescript: {
            alwaysTryTypes: true,
          },
        },
        'import/external-module-folders': [
          'node_modules',
          'node_modules/@types',
        ],
        'import/extensions': [
          ...baseConfig.settings['import/extensions'],
          ...tsImportExtensions,
        ],
        'import/parsers': {
          '@typescript-eslint/parser': [
            '.ts',
            '.tsx',
            '.mts',
            '.cts',
          ],
        },
      },
    }),
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
