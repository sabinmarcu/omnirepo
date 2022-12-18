import type {
  Config,
} from '../types.js';

const config = {
  overrides: [
    {
      files: [
        '*.type.spec.ts',
        '*.type.spec.tsx',
      ],
      extends: [
        'plugin:eslint-plugin-expect-type/recommended',
      ],
      plugins: [
        'eslint-plugin-expect-type',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
        'max-len': 0,
        '@typescript-eslint/naming-convention': 0,
      },
    },
  ],
} satisfies Config;

module.exports = config;
