import type { Config } from '../../types.js';

export const jsStrictRules = {
  strict: ['error', 'never'],
} as const satisfies Config['rules'];

const jsStrictConfig = [
  {
    name: 'JS Strict Rules',
    rules: jsStrictRules,
  },
] as const satisfies Config[];

export default jsStrictConfig;
