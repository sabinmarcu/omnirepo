import type { Config } from '../../types.js';
import { getLogger } from '../../utils/debug.js';
import { tryImport } from '../../utils/tryImport.js';

const typescriptParser = await tryImport('typescript-eslint');

const logger = getLogger('parser:typescript');

if (typescriptParser) {
  logger.log('Typescript Parser found. Loading');
} else {
  logger.warn('Typescript Parser not found, will not be parsing Tyepscript!');
}

const config = typescriptParser
  ? [
    {
      name: 'Typescript Parser',
      languageOptions: {
        parser: typescriptParser.parser,
        parserOptions: {
          projectService: true,
        },
      },
    },
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
