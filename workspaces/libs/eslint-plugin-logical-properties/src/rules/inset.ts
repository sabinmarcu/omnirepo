import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  left: 'insetInlineStart',
  right: 'insetInlineEnd',
  top: 'insetBlockStart',
  bottom: 'insetBlockEnd',
};

export const ruleConfig = {
  mappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
