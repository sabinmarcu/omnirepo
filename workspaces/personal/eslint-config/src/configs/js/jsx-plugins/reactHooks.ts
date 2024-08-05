import type { Config } from '../../../types';
import { getLogger } from '../../../utils/debug';
import { legacyPlugin } from '../../../utils/legacyPlugin';
import { tryImport } from '../../../utils/tryImport';
import reactHooksRules from '../jsx-rules/reactHooks';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';

const reactHooksPlugin = await tryImport('eslint-plugin-react-hooks');
const logger = getLogger('module:jsx:react-hooks');

if (!react) {
  logger.warn('React not found. Skipping react hooks config.');
} else if (!reactPlugin) {
  logger.warn('React Plugin not found. Skipping react hooks config.');
} else if (!reactHooksPlugin) {
  logger.warn('React Hooks Plugin not found. Skipping react hooks config.');
} else {
  logger.log('Loading React Hooks Rules');
}

const config = [
  makeJSXConfig({
    name: 'React Hooks Config',
    rules: reactHooksRules,
    plugins: {
      'react-hooks': legacyPlugin('eslint-plugin-react-hooks', 'react-hooks'),
    },
  }),
] as const satisfies Config[];

export default config;
