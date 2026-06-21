import type { Linter } from 'eslint';
import { prefixedRules as rules } from '../rules/index.js';
import {
  defaultFunctions,
  defaultJsxAttributes,
  defaultKeyframes,
  defaultResolvers,
  rulePrefix,
} from '../constants.js';
import plugin from '../plugin.js';
import type { PluginOptions } from '../types.js';

const getOptional = (
  input: string[] | Readonly<string[]> | undefined,
  fallback: string[] | Readonly<string[]>,
): string[] => ((input && input.length > 0) ? [...input] : [...fallback]);

export const createLogicalPropertiesConfig = <
  Severity extends Linter.RuleSeverity = 'error',
  Options extends Partial<PluginOptions> = {},
>(
    severity: Severity = 'error' as Severity,
    options: Options = {} as Options,
  ) => {
  const functions = getOptional(options.functions, defaultFunctions);
  const jsxAttributes = getOptional(options.jsxAttributes, defaultJsxAttributes);
  const keyframes = getOptional(options.keyframes, defaultKeyframes);
  const resolvers = getOptional(options.resolvers, defaultResolvers);
  const configOptions = {
    functions,
    jsxAttributes,
    keyframes,
    resolvers,
  } as const satisfies PluginOptions;

  const configRules = (
    Object.fromEntries(
      Object.keys(rules)
        .map((name) => [name, [severity, configOptions]]),
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
