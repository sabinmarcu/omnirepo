import { jsxConfigCompiler } from '../../constants/jsx.js';
import type { Config } from '../../types.js';
import { conditionalConfig } from '../../utils/conditionalConfig.js';
import { getLogger } from '../../utils/debug.js';
import { legacyPlugin } from '../../utils/legacyPlugin.js';

const logger = getLogger('plugin:react-hooks');
logger.log('Loading React Hooks Rules');

export const reactHooksRules = {} as const satisfies Config['rules'];

const reactHooksConfig = await conditionalConfig(
  'react',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  () => logger.warn('Skipping React Hooks Rules'),
  () => [
    jsxConfigCompiler({
      name: 'React Hooks Config',
      rules: reactHooksRules,
      plugins: {
        'react-hooks': legacyPlugin('eslint-plugin-react-hooks', 'react-hooks'),
      },
    }),
  ],
);

export default reactHooksConfig;
