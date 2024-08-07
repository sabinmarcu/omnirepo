import type { Config } from '../../types.js';
import { getLogger } from '../../utils/debug.js';
import { tryImport } from '../../utils/tryImport.js';

const babelParser = await tryImport('@babel/eslint-parser');

const logger = getLogger('parser:babel');

if (babelParser) {
  logger.log('Found Babel Parser. Loading');
} else {
  logger.warn('Babel Parser not found. Skipping');
}

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
