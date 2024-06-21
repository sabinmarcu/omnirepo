import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  overscrollBehaviorX: 'overscrollBehaviorInline',
  overscrollBehaviorY: 'overscrollBehaviorBlock',
};

export const ruleConfig = {
  mappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
