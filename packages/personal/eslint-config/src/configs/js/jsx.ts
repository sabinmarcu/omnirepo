import type {
  Config,
} from '../../types';

import reactConfig from './jsx-plugins/react';
import reactHooksConfig from './jsx-plugins/reactHooks';
import reactA11yConfig from './jsx-plugins/reactA11y';

const config = [
  ...reactConfig,
  ...reactHooksConfig,
  ...reactA11yConfig,
].filter(Boolean) satisfies Config[];

export default config;
