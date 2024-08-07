export const generateWorkspacesScopes = async (
  path = process.cwd(),
  withAliases = true,
) => {
  const {
    getAliasesNames,
    getWorkspacesNames,
  } = await import('@sabinmarcu/utils-repo');

  if (!withAliases) {
    return getWorkspacesNames.sync(path);
  }
  return getAliasesNames.sync(path);
};
