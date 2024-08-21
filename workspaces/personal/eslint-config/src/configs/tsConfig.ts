import stylisticTsPlugin from '@stylistic/eslint-plugin-ts';
import { getLogger } from '../utils/debug.js';
import { conditionalConfig } from '../utils/conditionalConfig.js';
import { tsConfigCompiler } from '../constants/ts.js';
import jsConfig from './jsConfig.js';

const logger = getLogger('config:ts');
logger.log('Loading TS Plugins and Rules');

const tsConfig = await conditionalConfig(
  'typescript-eslint',
  () => logger.warn('Skipping TS Configuration'),
  async ({
    'typescript-eslint': tsPlugin,
  }) => {
    const tsConfigRewrites = jsConfig.map((config) => {
      const {
        name, files, ...rest
      } = config as any;
      return tsConfigCompiler({
        name: name.replace('JS', 'TS'),
        ...rest,
      });
    });

    const tsRulesConfig = await import('../rules/ts.js');
    const tsResetConfig = await import('../rules/tsReset.js');
    const tsParserConfig = await import('../parsers/typescriptEslint.js');
    const tsImportConfig = await import('../import/tsImport.js');

    return [
      tsConfigCompiler({
        name: 'TS Plugins',
        plugins: {
          '@typescript-eslint': tsPlugin.plugin,
          '@stylistic/ts': stylisticTsPlugin as any,
        },
      }),
      ...tsConfigRewrites,
      ...tsRulesConfig.default.map(tsConfigCompiler),
      ...tsResetConfig.default.map(tsConfigCompiler),
      ...tsParserConfig.default.map(tsConfigCompiler),
      ...tsImportConfig.default.map(tsConfigCompiler),
    ];
  },
);

export default tsConfig;
