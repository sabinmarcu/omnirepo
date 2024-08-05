import type { Config } from '../../../types';
import bestPractices from './bestPractices';
import errors from './errors';
import es6 from './es6';
import imports from './imports';
import node from './node';
import strict from './strict';
import style from './style';
import variables from './variables';

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
