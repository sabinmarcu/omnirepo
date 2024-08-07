import type {
  Config,
} from '../../types.js';
import reactRules from '../js/jsx-rules/react.js';
import { tryImport } from '../../utils/tryImport.js';
import { makeConfigFactory } from '../../utils/makeConfig.js';
import JSXConfigs from '../js/jsx.js';
import { getLogger } from '../../utils/debug.js';

const tsPlugin = await tryImport('@typescript-eslint/eslint-plugin');
const makeConfig = makeConfigFactory('*.tsx');
const logger = getLogger('module:tsx');

if (tsPlugin) {
  logger.log('Loading Typescript JSX Rules');
} else {
  logger.warn('Skipping Typescript JSX Rules');
}

const config = tsPlugin
  ? [
    ...(
      JSXConfigs.map(({
        name, files, ...rest
      }) => (
        makeConfig({
          name: `TS ${name}`,
          ...rest,
        })
      ))
    ),
    makeConfig({
      name: 'TSX Config Fix',
      rules: {
        'react/jsx-filename-extension': [
          reactRules['react/jsx-filename-extension'][0],
          {
            ...reactRules['react/jsx-filename-extension'][1],
            extensions: [
              ...reactRules['react/jsx-filename-extension'][1].extensions,
              '.tsx',
            ],
          },
        ],
      },
    }),
  ] satisfies Config[]
  : [] satisfies Config[];

export default config;
