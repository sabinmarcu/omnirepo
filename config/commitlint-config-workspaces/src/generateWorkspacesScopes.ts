import { getWorkspacesNames } from '@sabinmarcu/utils-repo';

export const generateWorkspacesScopes = (
  path = process.cwd(),
  withAliases = true,
) => {
  const names = getWorkspacesNames.sync(path);
  if (!withAliases) {
    return names;
  }
  return names.flatMap(
    (name) => {
      const [,maybeScope, maybeName] = name.match(/(@[^/]+\/)?(.*)/)!;
      if (maybeScope) {
        return [maybeName, name];
      }
      return name;
    },
  ).filter(Boolean);
};
