import { getWorkspacesNamesSync } from '@sabinmarcu/utils-repo';

export const generateWorkspacesScopes = (
  path = process.cwd(),
  withAliases = true,
) => {
  const names = getWorkspacesNamesSync(path);
  if (!withAliases) {
    return names;
  }
  return names.map(
    (name) => {
      const [,maybeScope, maybeName] = name.match(/(@[^/]+\/)?(.*)/)!;
      if (maybeScope) {
        return [maybeName, name];
      }
      return name;
    },
  ).flat().filter(Boolean);
};
