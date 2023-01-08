import type { PackageJson } from 'type-fest';
import {
  allDependenciesOf,
  allDependenciesOfSync,
} from './allDependencies';

export const filterDependenciesByWorkspace = (
  dependencies: Record<string, string>,
) => Object.fromEntries(
  Object.entries(dependencies)
    .filter(([,version]) => version.startsWith('workspace:')),
);

export const workspaceDependenciesOfSync = (
  manifest: PackageJson | string,
) => {
  const dependencies = allDependenciesOfSync(manifest);
  return filterDependenciesByWorkspace(dependencies);
};

export const workspaceDependenciesOf = async (
  manifest: PackageJson | string,
) => {
  const dependencies = await allDependenciesOf(manifest);
  return filterDependenciesByWorkspace(dependencies);
};
