import type { Config } from '../../types.js';
import jsStyleConfig from './style.js';
import jsVariablesConfig from './variables.js';
import jsErrorConfig from './errors.js';
import jsES6Config from './es6.js';
import jsImportConfig from './import.js';
import jsNodeConfig from './node.js';
import jsStrictConfig from './strict.js';
import jsBestPracticesConfig from './bestPractices.js';

const jsRules = [
  ...jsStyleConfig,
  ...jsVariablesConfig,
  ...jsErrorConfig,
  ...jsES6Config,
  ...jsImportConfig,
  ...jsNodeConfig,
  ...jsStrictConfig,
  ...jsBestPracticesConfig,
] as const satisfies Config[];

export default jsRules;
