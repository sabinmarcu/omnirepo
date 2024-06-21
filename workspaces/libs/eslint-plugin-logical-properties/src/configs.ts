import type { ESLint } from 'eslint';
import { createRecommendedConfig } from './utils/createRecommendedConfig.js';

const recommended = createRecommendedConfig();
const warning = createRecommendedConfig('warn');
const disable = createRecommendedConfig('off');

export const configs = {
  recommended,
  warning,
  disable,
} as const satisfies ESLint.Plugin['configs'];
