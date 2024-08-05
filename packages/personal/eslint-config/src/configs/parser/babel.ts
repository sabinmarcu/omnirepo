import type { Config } from '../../types';
import { tryImport } from '../../utils/tryImport';

const babelParser = await tryImport('@babel/eslint-parser');

const config = babelParser
  ? [
    {
      name: 'Babel Parser',
      languageOptions: {
        parser: babelParser,
        parserOptions: {
          ecmaFeatures: {
            generators: false,
            objectLiteralDuplicateProperties: false,
          },

        },
      },
    },
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
