import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const values = {
  float: {
    left: 'inline-start',
    right: 'inline-end',
  },
} as const satisfies DirectionalRuleConfig['values'];

export const ruleConfig = {
  values,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
