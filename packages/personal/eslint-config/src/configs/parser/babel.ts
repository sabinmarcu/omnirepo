import type { Config } from '../../types';
import { tryImport } from '../../utils/tryImport';

const babelParser = await tryImport('@babel/eslint-parser');

const config = [
  babelParser && {
    name: 'Babel Parser',
    parser: babelParser,
    languageOptions: {
      ecmaFeatures: {
        generators: false,
        objectLiteralDuplicateProperties: false,
      },
    },
  },
] satisfies Config[];

export default config;
