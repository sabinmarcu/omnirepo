import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  marginLeft: 'marginInlineStart',
  marginRight: 'marginInlineEnd',
  marginTop: 'marginBlockStart',
  marginBottom: 'marginBlockEnd',
};

export const shorthands = {
  margin: [
    [
      [
        mappings.marginTop,
        mappings.marginBottom,
        mappings.marginLeft,
        mappings.marginRight,
      ],
    ],
    [[mappings.marginTop, mappings.marginBottom], [mappings.marginLeft, mappings.marginRight]],
    [
      [mappings.marginTop],
      [mappings.marginLeft, mappings.marginRight],
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

export const ruleConfig = {
  mappings,
  shorthands,
} satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
