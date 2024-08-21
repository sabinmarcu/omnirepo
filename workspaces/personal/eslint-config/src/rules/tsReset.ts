import type { Config } from '../types.js';

export const tsResetRules = {
  'constructor-super': 'off',
  'getter-return': 'off',
  'no-const-assign': 'off',
  'no-dupe-args': 'off',
  'no-dupe-class-members': 'off',
  'no-dupe-keys': 'off',
  'no-func-assign': 'off',
  'no-import-assign': 'off',
  'no-new-symbol': 'off',
  'no-obj-calls': 'off',
  'no-redeclare': 'off',
  'no-setter-return': 'off',
  'no-this-before-super': 'off',
  'no-undef': 'off',
  'no-unreachable': 'off',
  'no-unsafe-negation': 'off',
  'valid-typeof': 'off',
  'import/named': 'off',
  'import/no-named-as-default-member': 'off',
  'import/no-unresolved': 'off',
} as const satisfies Config['rules'];

const tsResetConfig = [
  {
    name: 'TS Reset Rules',
    rules: tsResetRules,
  },
] as const satisfies Config[];

export default tsResetConfig;
