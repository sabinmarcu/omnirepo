import type { Config } from '../../../types.js';
import bestPractices from './bestPractices.js';
import errors from './errors.js';
import es6 from './es6.js';
import imports from './imports.js';
import node from './node.js';
import strict from './strict.js';
import style from './style.js';
import variables from './variables.js';

export default {
  ...bestPractices,
  ...errors,
  ...es6,
  ...imports,
  ...node,
  ...strict,
  ...style,
  ...variables,
} as const satisfies Config['rules'];
