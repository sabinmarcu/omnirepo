import {
  getAliasesNames,
  getWorkspacesNames,
} from '@sabinmarcu/utils-repo';

export const generateWorkspacesScopes = (
  path = process.cwd(),
  withAliases = true,
) => {
  if (!withAliases) {
    return getWorkspacesNames.sync(path);
  }
  return getAliasesNames.sync(path);
};
