import globals from 'globals';
import type { Config } from '../types.js';

type ExtractESVersions<T extends string> = T extends `es${infer Version extends number}`
  ? Version
  : never;
type ESVersion = ExtractESVersions<keyof typeof globals>;

const ecmaVersion: ESVersion = 2024;

const baseParserConfig = [
  {
    name: 'Base Parser Config',
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
] as const satisfies Config[];

export default baseParserConfig;
