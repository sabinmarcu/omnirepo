import globals from 'globals';
import type { Config } from '../../types';

type ExtractESVersions<T extends string> = T extends `es${infer Version extends number}`
  ? Version
  : never;
type ESVersion = ExtractESVersions<keyof typeof globals>;

const ecmaVersion: ESVersion = 2024;

const config = [
  {
    name: 'Shared Parser Options',
    languageOptions: {
      ecmaVersion,
      sourceType: 'module',
      globals: {
        ...globals[`es${ecmaVersion}`],
        ...globals.node,
      },
    },
  },
] satisfies Config[];

export default config;
