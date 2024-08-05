import type { Config } from '../../../types';
import { tryImport } from '../../../utils/tryImport';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';

import reactA11yRules from '../jsx-rules/reactA11y';
import { getLogger } from '../../../utils/debug';

const logger = getLogger('module:jsx:react-a11y');

const jsxA11yPlugin = await tryImport('eslint-plugin-jsx-a11y');

if (!react) {
  logger.warn('React not found. Skipping react a11y config.');
} else if (!reactPlugin) {
  logger.warn('React Plugin not found. Skipping react a11y config.');
} else if (!jsxA11yPlugin) {
  logger.warn('React A11Y Plugin not found. Skipping react a11y config.');
} else {
  logger.log('Lodin A11Y Rules');
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
