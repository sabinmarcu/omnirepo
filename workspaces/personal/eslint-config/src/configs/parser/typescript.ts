import type { Config } from '../../types';
import { getLogger } from '../../utils/debug';
import { tryImport } from '../../utils/tryImport';

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
      },
    },
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
