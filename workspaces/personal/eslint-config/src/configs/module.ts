import commonjsConfig from '../rules/commonjs.js';
import esmConfig from '../rules/esm.js';
import type { Config } from '../types.js';
import { getLogger } from '../utils/debug.js';

getLogger('module').log('Loading Module Types Config');

const moduleConfig = [...commonjsConfig, ...esmConfig] as const satisfies Config[];

export default moduleConfig;
