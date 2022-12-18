import { generateWorkspacesScopes } from './generateWorkspacesScopes';

export const generateWorkspacesConfig = (
  extraScopes: string[] = [],
  path = process.cwd(),
  withAliases = true,
) => ({
  rules: {
    'scope-empty': [
      2,
      'never',
    ],
    'scope-enum': [
      2,
      'always',
      [
        ...generateWorkspacesScopes(path, withAliases),
        ...extraScopes,
      ],
    ],
  },
});
