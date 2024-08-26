import type { ESLint } from 'eslint';
import { createLogicalPropertiesConfig } from './utils/createLogicalPropertiesConfig.js';

const recommended = createLogicalPropertiesConfig();
const warning = createLogicalPropertiesConfig('warn');
const disable = createLogicalPropertiesConfig('off');

export const configs = {
  recommended,
  warning,
  disable,
} as const satisfies ESLint.Plugin['configs'];
