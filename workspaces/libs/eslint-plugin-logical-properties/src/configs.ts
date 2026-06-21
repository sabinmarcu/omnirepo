import type {
  ESLint,
  Linter,
} from 'eslint';
import {
  rulePrefix,
  defaultFunctions,
  defaultKeyframes,
  defaultResolvers,
  defaultJsxAttributes,
} from './constants.js';
import plugin from './plugin.js';
import { prefixedRules } from './rules/index.js';

const createPreset = (severity: Linter.RuleSeverity) => {
  const rules = Object.fromEntries(
    Object.keys(prefixedRules).map((name) => [name, severity]),
  ) satisfies Linter.Config['rules'];

  return {
    plugins: {
      [rulePrefix]: plugin,
    },
    settings: {
      [rulePrefix]: {
        functions: defaultFunctions,
        keyframes: defaultKeyframes,
        resolvers: defaultResolvers,
        jsxAttributes: defaultJsxAttributes,
      },
    },
    rules,
  } as const satisfies Linter.Config;
};

const recommended = createPreset('error');
const warning = createPreset('warn');
const disable = createPreset('off');

export const configs = {
  recommended,
  warning,
  disable,
} as const satisfies ESLint.Plugin['configs'];
