import moizeImport, { type Moize } from 'moize';
import type { PackageJson } from 'type-fest';
import {
  allDependenciesOf,
  allDependenciesOfSync,
} from './allDependencies.js';

const moize = moizeImport as unknown as Moize;

export const filterDependenciesByWorkspace = (
  dependencies: Record<string, string>,
) => Object.fromEntries(
  Object.entries(dependencies)
    .filter(([, version]) => version.startsWith('workspace:')),
);

const workspaceDependenciesOfSyncRaw = (
  manifest: PackageJson | string,
) => {
  const dependencies = allDependenciesOfSync(manifest);
  return filterDependenciesByWorkspace(dependencies);
};
export const workspaceDependenciesOfSync = moize(
  workspaceDependenciesOfSyncRaw,
) as typeof workspaceDependenciesOfSyncRaw;

const workspaceDependenciesOfRaw = async (
  manifest: PackageJson | string,
) => {
  const dependencies = await allDependenciesOf(manifest);
  return filterDependenciesByWorkspace(dependencies);
};
export const workspaceDependenciesOf = moize.promise(
  workspaceDependenciesOfRaw,
) as typeof workspaceDependenciesOfRaw;
