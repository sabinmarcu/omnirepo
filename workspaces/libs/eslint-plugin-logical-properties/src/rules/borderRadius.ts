import type { DirectionalRuleConfig } from '../types.js';
import { generateDirectionalRules } from '../parsers/directional.js';

export const mappings = {
  borderTopLeftRadius: 'borderStartStartRadius',
  borderTopRightRadius: 'borderStartEndRadius',
  borderBottomLeftRadius: 'borderEndStartRadius',
  borderBottomRightRadius: 'borderEndEndRadius',
} as const;

export const shorthands = {
  borderRadius: [
    [
      [
        mappings.borderTopLeftRadius,
        mappings.borderTopRightRadius,
        mappings.borderBottomRightRadius,
        mappings.borderBottomLeftRadius,
      ],
    ],
    [
      [mappings.borderTopLeftRadius, mappings.borderBottomRightRadius],
      [mappings.borderTopRightRadius, mappings.borderBottomLeftRadius],
    ],
    [
      [mappings.borderTopLeftRadius],
      [mappings.borderTopRightRadius, mappings.borderBottomLeftRadius],
      [mappings.borderBottomRightRadius],
    ],
    [
      [mappings.borderTopLeftRadius],
      [mappings.borderTopRightRadius],
      [mappings.borderBottomRightRadius],
      [mappings.borderBottomLeftRadius],
    ],
  ],
} as const satisfies DirectionalRuleConfig['shorthands'];

export const ruleConfig = {
  mappings,
  shorthands,
} as const satisfies DirectionalRuleConfig;

export default generateDirectionalRules(ruleConfig);
