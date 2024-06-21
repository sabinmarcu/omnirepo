import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  borderLeft: 'borderInlineStart',
  borderLeftColor: 'borderInlineStartColor',
  borderLeftStyle: 'borderInlineStartStyle',
  borderLeftWidth: 'borderInlineStartWidth',
  borderRight: 'borderInlineEnd',
  borderRightColor: 'borderInlineEndColor',
  borderRightStyle: 'borderInlineEndStyle',
  borderRightWidth: 'borderInlineEndWidth',
  borderTop: 'borderBlockStart',
  borderTopColor: 'borderBlockStartColor',
  borderTopStyle: 'borderBlockStartStyle',
  borderTopWidth: 'borderBlockStartWidth',
  borderBottom: 'borderBlockEnd',
  borderBottomColor: 'borderBlockEndColor',
  borderBottomStyle: 'borderBlockEndStyle',
  borderBottomWidth: 'borderBlockEndWidth',
};

export const shorthandMappings = {
  border: [
    mappings.borderLeft,
    mappings.borderRight,
    mappings.borderTop,
    mappings.borderBottom,
  ],
} satisfies DirectionalRuleConfig['shorthandMappings'];

export const ruleConfig = {
  mappings,
  shorthandMappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
