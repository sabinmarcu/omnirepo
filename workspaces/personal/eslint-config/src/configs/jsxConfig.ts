import reactConfig from '../rules/jsx/react.js';
import reactA11yConfig from '../rules/jsx/reactA11y.js';
import reactHooksConfig from '../rules/jsx/reactHooks.js';
import type { Config } from '../types.js';

const jsxConfig = [
  ...reactConfig,
  ...reactA11yConfig,
  ...reactHooksConfig,
] as const satisfies Config[];

export default jsxConfig;
