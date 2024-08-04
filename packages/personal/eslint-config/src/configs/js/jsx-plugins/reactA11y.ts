import type { Config } from '../../../types';
import { tryImport } from '../../../utils/tryImport';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';

import reactA11yRules from '../jsx-rules/reactA11y';

const jsxA11yPlugin = await tryImport('eslint-plugin-jsx-a11y');

if (!react) {
  console.error('React not found. Skipping react a11y config.');
} else if (!reactPlugin) {
  console.error('React Plugin not found. Skipping react a11y config.');
} else if (!jsxA11yPlugin) {
  console.error('React A11Y Plugin not found. Skipping react a11y config.');
}

const config = [
  makeJSXConfig({
    name: 'A11Y Config',
    rules: reactA11yRules,
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
  }),
] as const satisfies Config[];

export default config;
