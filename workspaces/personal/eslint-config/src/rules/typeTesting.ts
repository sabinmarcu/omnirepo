import { configs } from 'eslint-plugin-expect-type';
import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';

export const typeTestingRules = {
  ...configs.recommended.rules,
  '@typescript-eslint/no-unused-vars': 0,
  '@typescript-eslint/no-unused-expressions': 0,
  '@typescript-eslint/naming-convention': 0,
  'max-len': 0,
  'no-lone-blocks': 0,
} as const satisfies Config['rules'];

const typeTestingRulesConfig = [
  compileConfigFor(
    '*.type.spec.@(ts|tsx)',
  )({
    name: 'Type Testing Rules',
    rules: typeTestingRules,
  }),
] as const satisfies Config[];

export default typeTestingRulesConfig;
