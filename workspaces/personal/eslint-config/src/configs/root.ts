import { compileConfigFilesConfigFor } from '../utils/compileConfigFilesConfig.js';
import type {
  Config,
} from '../types.js';
import { getLogger } from '../utils/debug.js';

getLogger('config:root-config').log('Loading root config files');

export const compileConfigFilesConfig = compileConfigFilesConfigFor({
  name: 'Root Configs',
  rules: {
    'global-require': 0,
    'import/no-extraneous-dependencies': 0,
    'unicorn/prefer-module': 0,
    'unicorn/no-await-expression-member': 0,
    'import/extension': 0,
  },
});

const rootConfigsConfig = [compileConfigFilesConfig('/')] satisfies Config[];

export default rootConfigsConfig;
