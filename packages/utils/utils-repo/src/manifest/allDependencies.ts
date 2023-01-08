import type { PackageJson } from 'type-fest';
import {
  manifestOf,
  manifestOfSync,
} from './manifestOf';

export const allDependenciesOfSync = (
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

export const allDependenciesOf = async (
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
