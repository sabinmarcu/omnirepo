import type { Config } from '../../../types';
import {
  makeJSXConfig,
  react,
  reactPlugin,
} from './shared';
import reactRules from '../jsx-rules/react';

if (!react) {
  console.error('React not found. Skipping react config');
} else if (!reactPlugin) {
  console.error('React Plugin not found. Skipping react config');
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
