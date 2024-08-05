import type { Config } from '../../../types';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';
import reactRules from '../jsx-rules/react';
import { getLogger } from '../../../utils/debug';

const logger = getLogger('module:jsx:react');

if (!react) {
  logger.warn('React not found. Skipping react config');
} else if (!reactPlugin) {
  logger.warn('React Plugin not found. Skipping react config');
} else {
  logger.log('Loading React Rules');
}

const config = [
  (react && reactPlugin) && makeJSXConfig({
    name: 'JSX Config',
    rules: reactRules,
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: react.version,
      },
    },
  }),
] as const satisfies Config[];

export default config;
