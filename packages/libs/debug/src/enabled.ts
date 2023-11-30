import micromatch from 'micromatch';
import type {
  DebugDefinition,
  DebugRule,
} from './types';
import { debugRules } from './config';

export const definitionIsEnabled = (
  definition: DebugDefinition,
  rules: DebugRule[],
) => {
  let isEnabled = false;
  for (const rule of rules) {
    if (rule.enabled && !isEnabled) {
      if (rule.path && micromatch.isMatch(definition.path, rule.path)) {
        isEnabled = true;
      }
      if (rule.namespace && micromatch.isMatch(definition.namespace, rule.namespace)) {
        isEnabled = true;
      }
      if (rule.channel && micromatch.isMatch(definition.channel, rule.channel)) {
        isEnabled = true;
      }
    } else if (isEnabled) {
      if (rule.path && micromatch.isMatch(definition.path, rule.path)) {
        isEnabled = false;
      }
      if (rule.namespace && micromatch.isMatch(definition.namespace, rule.namespace)) {
        isEnabled = false;
      }
      if (rule.channel && micromatch.isMatch(definition.channel, rule.channel)) {
        isEnabled = false;
      }
    }
  }
  return isEnabled;
};

export const debugDefinitionEnabled = (
  definition: DebugDefinition,
) => {
  const result = debugRules.map(
    (rules) => definitionIsEnabled(definition, rules ?? []),
  );
  return result;
};
