import { jsxConfigCompiler } from '../../constants/jsx.js';
import { conditionalConfig } from '../../utils/conditionalConfig.js';
import { getLogger } from '../../utils/debug.js';

const logger = getLogger('plugin:react-hooks');
logger.log('Loading React Hooks Rules');

const reactHooksConfig = await conditionalConfig(
  'react',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  () => logger.warn('Skipping React Hooks Rules'),
  ({ 'eslint-plugin-react-hooks': reactHooksModule }) => {
    const reactHooksPlugin = reactHooksModule.default ?? reactHooksModule;

    return [
      jsxConfigCompiler({
        name: 'React Hooks Config',
        rules: reactHooksPlugin.configs.flat.recommended.rules,
        plugins: {
          'react-hooks': reactHooksPlugin,
        },
      }),
    ];
  },
);

export default reactHooksConfig;
