import globals from 'globals';
import type { Config } from '../../types';
import { getLogger } from '../../utils/debug';

type ExtractESVersions<T extends string> = T extends `es${infer Version extends number}`
  ? Version
  : never;
type ESVersion = ExtractESVersions<keyof typeof globals>;

const ecmaVersion: ESVersion = 2024;

getLogger('parser:shared').log('Loading shared language options');

const config = [
  {
    name: 'Shared Parser Options',
    languageOptions: {
      parserOptions: {
        ecmaVersion,
        sourceType: 'module',
      },
      globals: {
        ...globals[`es${ecmaVersion}`],
        ...globals.browser,
        ...globals.node,
      },
    },
  },
] satisfies Config[];

export default config;
