import type {
  Config,
} from '../../types.js';
import reactConfig from './jsx-plugins/react.js';
import reactHooksConfig from './jsx-plugins/reactHooks.js';
import reactA11yConfig from './jsx-plugins/reactA11y.js';
import { getLogger } from '../../utils/debug.js';

getLogger('module:jsx').log('Loading JSX Rules');

const config = [
  ...reactConfig,
  ...reactHooksConfig,
  ...reactA11yConfig,
].filter(Boolean) satisfies Config[];

export default config;
