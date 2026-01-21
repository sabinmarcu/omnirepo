import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';
import config from '@sabinmarcu/eslint-config';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
const eslintConfig = defineConfig([
  ...config,
  {
    name: 'Root Config',
    ignores: [
      '**/dist',
    ],
  },
  {
    name: 'Commands Override',
    files: ['**/*Command.?(m|c)ts?(x)'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  },
  {
    files: ['**/timer40k/**/*.tsx'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  {
    name: 'Website ignores (thanks, nextjs)',
    files: ['**/website/**/*.tsx', '**/website/**/*.ts'],
    rules: {
      'import/extensions': ['off'],
    },
  },
  {
    name: 'NextJS Rules for Website',
    files: ['**/website/**/*.tsx', '**/website/**/*.ts'],
    plugins: nextPlugin.configs['core-web-vitals'].plugins,
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'import/extensions': ['off'],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
