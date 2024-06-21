import { rulePrefix } from '../constants.js';

export const prefixRules = <T extends Record<string, any>>(
  rules: T,
): {
    [Key in keyof typeof rules & string as `${typeof rulePrefix}/${Key}`]: (typeof rules)[Key]
  } => (
    Object.fromEntries(
      Object.entries(rules)
        .map(([name, rule]) => [`${rulePrefix}/${name}`, rule]),
    ) as unknown as any
  );
