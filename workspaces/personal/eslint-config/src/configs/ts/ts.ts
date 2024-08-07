import stylisticTsPlugin from '@stylistic/eslint-plugin-ts';
import type {
  Config,
} from '../../types.js';
import { tryImport } from '../../utils/tryImport.js';
import { makeTSConfig } from './import.js';
import rules from './rules.js';
import JSConfigs from '../js.js';
import { getLogger } from '../../utils/debug.js';

const logger = getLogger('module:ts');
const tsPlugin = await tryImport('typescript-eslint');

if (tsPlugin) {
  logger.log('Loading Typescript Rules');
} else {
  logger.error('Typescript Plugin not loaded. Skipping Typescript rules.');
}

const config = tsPlugin
  ? [
    ...(
      JSConfigs.map(({
        name, files, ...rest
      }) => (
        makeTSConfig({
          name: `TS ${name}`,
          ...rest,
        })
      ))
    ),
    makeTSConfig({
      name: 'Typescript Config',
      plugins: {
        '@typescript-eslint': tsPlugin.plugin,
        '@stylistic/ts': stylisticTsPlugin as any,
      },
    }),
    makeTSConfig({
      name: 'Typescript Rules',
      rules,
    }),
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
