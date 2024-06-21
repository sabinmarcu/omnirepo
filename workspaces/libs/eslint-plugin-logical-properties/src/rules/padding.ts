import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  paddingLeft: 'paddingInlineStart',
  paddingRight: 'paddingInlineEnd',
  paddingTop: 'paddingBlockStart',
  paddingBottom: 'paddingBlockEnd',
};

export const shorthands = {
  padding: [
    [
      [
        mappings.paddingTop,
        mappings.paddingBottom,
        mappings.paddingLeft,
        mappings.paddingRight,
      ],
    ],
    [
      [mappings.paddingTop, mappings.paddingBottom],
      [mappings.paddingLeft, mappings.paddingRight],
    ],
    [
      [mappings.paddingTop],
      [mappings.paddingLeft, mappings.paddingRight],
      [mappings.paddingBottom],
    ],
    [
      [mappings.paddingTop],
      [mappings.paddingRight],
      [mappings.paddingBottom],
      [mappings.paddingLeft],
    ],
  ],
} satisfies DirectionalRuleConfig['shorthands'];

export const ruleConfig = {
  mappings,
  shorthands,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
