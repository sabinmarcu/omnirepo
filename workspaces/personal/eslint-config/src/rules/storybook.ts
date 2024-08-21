import storybookPlugin from 'eslint-plugin-storybook';
import type { Config } from '../types.js';
import { compileConfigFor } from '../utils/compileConfig.js';

export const storybookRules = {
  ...storybookPlugin.configs.recommended.rules,
  'no-underscore-dangle': 'off',
  'import/no-extraneous-dependencies': 'off',
} as const satisfies Config['rules'];

const storybookRulesConfig = [
  compileConfigFor(
    '*.stories.@(ts|tsx|js|jsx|mjs|cjs)',
  )({
    name: 'Storybook Rules',
    rules: storybookRules,
  }),
  compileConfigFor(
    '*.stories.@(ts|tsx)',
  )({
    name: 'Storybook TS Overrides',
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  }),
] as const satisfies Config[];

export default storybookRulesConfig;
