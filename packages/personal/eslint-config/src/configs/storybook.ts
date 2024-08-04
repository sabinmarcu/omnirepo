import type {
  Config,
} from '../types';
import { makeConfigFactory } from '../utils/makeConfig';
import { tryImport } from '../utils/tryImport';

const storybookPlugin = await tryImport('eslint-plugin-storybook');

if (!storybookPlugin) {
  console.warn('Storybook plugin not found, not loading Storybook rules');
}

const config = storybookPlugin
  ? [
    makeConfigFactory(
      '*.stories.@(ts|tsx|js|jsx|mjs|cjs)',
    )({
      name: 'Storybook Config',
      rules: {
        ...storybookPlugin.configs.recommended.rules,
        'no-underscore-dangle': 'off',
      },
    }),
    makeConfigFactory(
      '*.stories.@(ts|tsx)',
    )({
      name: 'Storybook TS Overrides',
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    }),
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
