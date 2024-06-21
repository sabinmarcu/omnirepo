import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  width: 'inlineSize',
  height: 'blockSize',
  minWidth: 'minInlineSize',
  minHeight: 'minBlockSize',
  maxWidth: 'maxInlineSize',
  maxHeight: 'maxBlockSize',
};

export const ruleConfig = {
  mappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
