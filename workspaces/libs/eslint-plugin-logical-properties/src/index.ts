import type { ESLint } from 'eslint';
import { configs } from './configs.js';
import plugin from './plugin.js';

const finalPlugin = {
  ...plugin,
  configs,
} as const satisfies ESLint.Plugin;

export default finalPlugin;
