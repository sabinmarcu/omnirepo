import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  paddingLeft: 'paddingInlineStart',
  paddingRight: 'paddingInlineEnd',
  paddingTop: 'paddingBlockStart',
  paddingBottom: 'paddingBlockEnd',
  block: 'paddingBlock',
  inline: 'paddingInline',
};

export const shorthands = {
  padding: [
    [[mappings.paddingTop, mappings.paddingBottom]],
    [
      [mappings.paddingTop, mappings.paddingBottom],
      [mappings.paddingLeft, mappings.paddingRight],
    ],
    [
      [mappings.paddingTop],
      [mappings.inline],
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

export const shorthandPairMappings = {
  padding: [
    [mappings.block],
    [mappings.inline],
  ],
} as const satisfies DirectionalRuleConfig['shorthandPairMappings'];

export const ruleConfig = {
  mappings,
  shorthands,
  shorthandPairMappings,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
