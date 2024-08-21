import { conditionalConfig } from '../utils/conditionalConfig.js';
import { getLogger } from '../utils/debug.js';

const logger = getLogger('config:storybook');
logger.log('Loading Storybook Config');

const storybookConfig = await conditionalConfig(
  'eslint-plugin-storybook',
  () => logger.warn('Skipping Storybook Configuration'),
  async ({
    'eslint-plugin-storybook': storybookPlugin,
  }) => {
    const storybookRulesConfig = await import('../rules/storybook.js');

    return [
      {
        name: 'Storybook Plugin',
        plugins: {
          storybook: storybookPlugin,
        },
      },
      ...storybookRulesConfig.default,
    ];
  },
);

export default storybookConfig;
