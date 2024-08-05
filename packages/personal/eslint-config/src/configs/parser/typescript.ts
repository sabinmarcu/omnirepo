import type { Config } from '../../types';
import { tryImport } from '../../utils/tryImport';

const typescriptParser = await tryImport('typescript-eslint');

if (!typescriptParser) {
  console.warn('Typescript Parser not found, will not be parsing Tyepscript!');
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
