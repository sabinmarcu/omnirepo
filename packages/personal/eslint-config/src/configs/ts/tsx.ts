import type {
  Config,
} from '../../types';

import reactRules from '../js/jsx-rules/react';
import { tryImport } from '../../utils/tryImport';
import { makeConfigFactory } from '../../utils/makeConfig';
import JSXConfigs from '../js/jsx';

const tsPlugin = await tryImport('@typescript-eslint/eslint-plugin');
const makeConfig = makeConfigFactory('*.tsx');

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
