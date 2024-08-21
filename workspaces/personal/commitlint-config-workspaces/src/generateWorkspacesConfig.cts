/* eslint-disable unicorn/prefer-module */
const { generateWorkspacesScopes } = require('./generateWorkspacesScopes.cjs');

export const generateWorkspacesConfig = async (
  extraScopes: string[] = [],
  path = process.cwd(),
  withAliases = true,
) => ({
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [
      2,
      'always',
      [...(await generateWorkspacesScopes(path, withAliases)), ...extraScopes],
    ],
  },
});
