import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  overflowX: 'overflowInline',
  overflowY: 'overflowBlock',
};

export const ruleConfig = {
  mappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
