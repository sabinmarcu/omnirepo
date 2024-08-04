import type { Config } from '../../../types';
import { legacyPlugin } from '../../../utils/legacyPlugin';
import { tryImport } from '../../../utils/tryImport';
import reactHooksRules from '../jsx-rules/reactHooks';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';

const reactHooksPlugin = await tryImport('eslint-plugin-react-hooks');

if (!react) {
  console.error('React not found. Skipping react hooks config.');
} else if (!reactPlugin) {
  console.error('React Plugin not found. Skipping react hooks config.');
} else if (!reactHooksPlugin) {
  console.error('React Hooks Plugin not found. Skipping react hooks config.');
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
