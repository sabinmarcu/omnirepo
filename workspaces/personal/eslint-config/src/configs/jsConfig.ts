import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import canonicalPlugin from 'eslint-plugin-canonical';
import type {
  Config,
} from '../types.js';
import { getLogger } from '../utils/debug.js';
import jsRules from '../rules/js/index.js';
import { jsConfigCompiler } from '../constants/js.js';
import jsImportConfig from '../import/jsImport.js';
import baseParserConfig from '../parsers/base.js';

getLogger('config:js').log('Loading JS Plugins and Rules');

const jsConfig = [
  ...baseParserConfig,
  jsConfigCompiler({
    name: 'JS Config',
    plugins: {
      '@stylistic/js': stylisticJsPlugin as any,
      canonical: canonicalPlugin,
    },
  }),
  ...jsImportConfig,
  ...jsRules.map(jsConfigCompiler),
] as const satisfies Config[];

export default jsConfig;
