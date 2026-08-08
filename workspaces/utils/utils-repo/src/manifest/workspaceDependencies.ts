// eslint-disable-next-line import/extensions -- Moize's ESM entry requires its .mjs extension.
import moize from 'moize/mjs/index.mjs';
import type { PackageJson } from '@sabinmarcu/types';
import {
  allDependenciesOf,
  allDependenciesOfSync,
} from './allDependencies.js';

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
