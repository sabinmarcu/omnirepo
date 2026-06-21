import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  marginLeft: 'marginInlineStart',
  marginRight: 'marginInlineEnd',
  marginTop: 'marginBlockStart',
  marginBottom: 'marginBlockEnd',
  block: 'marginBlock',
  inline: 'marginInline',
};

export const shorthands = {
  margin: [
    [[mappings.marginTop, mappings.marginBottom]],
    [[mappings.marginTop, mappings.marginBottom], [mappings.marginLeft, mappings.marginRight]],
    [
      [mappings.marginTop],
      [mappings.inline],
      [mappings.marginBottom],
    ],
    [
      [mappings.marginTop],
      [mappings.marginRight],
      [mappings.marginBottom],
      [mappings.marginLeft],
    ],
  ],
} satisfies DirectionalRuleConfig['shorthands'];

export const shorthandPairMappings = {
  margin: [
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
