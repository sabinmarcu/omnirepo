import type {
  Config,
} from '../types';
import { getLogger } from '../utils/debug';
import { makeConfigFactory } from '../utils/makeConfig';
import { tryImport } from '../utils/tryImport';

const storybookPlugin = await tryImport('eslint-plugin-storybook');
const logger = getLogger('plugin:storybook');

if (storybookPlugin) {
  logger.log('Enabling Storybook Rules');
} else {
  logger.warn('Storybook Plugin not found. Skipping');
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
