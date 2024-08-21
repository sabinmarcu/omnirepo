import { conditionalConfig } from '../utils/conditionalConfig.js';
import { getLogger } from '../utils/debug.js';

const logger = getLogger('config:type-testing');
logger.log('Loading Type Testing Config');

const typeTestingConfig = await conditionalConfig(
  'eslint-plugin-expect-type',
  () => logger.warn('Skipping Type Testing Configuration'),
  async ({
    'eslint-plugin-expect-type': expectTypePlugin,
  }) => {
    const typeTestingRulesConfig = await import('../rules/typeTesting.js');

    return [
      {
        name: 'Type Testing Plugin',
        plugins: {
          'expect-type': expectTypePlugin,
        },
      },
      ...typeTestingRulesConfig.default,
    ];
  },
);

export default typeTestingConfig;
