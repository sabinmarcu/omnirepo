import type { Linter } from 'eslint';
import { prefixedRules as rules } from '../rules/index.js';
import {
  defaultFunctionNames,
  rulePrefix,
} from '../constants.js';
import plugin from '../plugin.js';

export const createRecommendedConfig = <
  Severity extends Linter.RuleSeverity = 'error',
  Options extends string = typeof defaultFunctionNames[number],
>(
    severity: Severity = 'error' as any,
    ...options: Options[]
  ) => {
  const functions = options?.length > 0 ? options : defaultFunctionNames;

  const configRules = (
    Object.fromEntries(
      Object.keys(rules)
        .map((name) => [name, [severity, ...functions]]),
    )
  ) as unknown as {
    [Key in keyof typeof rules]: [Severity, ...Options[]];
  } satisfies Linter.Config['rules'];

  return {
    plugins: {
      [rulePrefix]: plugin,
    },
    rules: configRules,
  } as const satisfies Linter.Config;
};
