import moizeImport, { type Moize } from 'moize';
import type { PackageJson } from 'type-fest';
import {
  manifestOf,
  manifestOfSync,
} from './manifestOf.js';

const moize = moizeImport as unknown as Moize;

const allDependenciesOfSyncRaw = (
  manifest: PackageJson | string,
) => {
  const localManifest = typeof manifest === 'string'
    ? manifestOfSync(manifest)
    : manifest;
  return {
    ...localManifest.dependencies,
    ...localManifest.devDependencies,
    ...localManifest.peerDependencies,
    ...localManifest.optionalDependencies,
  } as Record<string, string>;
};
export const allDependenciesOfSync = moize(
  allDependenciesOfSyncRaw,
) as typeof allDependenciesOfSyncRaw;

const allDependenciesOfRaw = async (
  manifest: PackageJson | string,
) => {
  const localManifest = typeof manifest === 'string'
    ? await manifestOf(manifest)
    : manifest;
  return {
    ...localManifest.dependencies,
    ...localManifest.devDependencies,
    ...localManifest.peerDependencies,
    ...localManifest.optionalDependencies,
  } as Record<string, string>;
};
export const allDependenciesOf = moize.promise(allDependenciesOfRaw) as typeof allDependenciesOfRaw;
