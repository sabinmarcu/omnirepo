import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
import type { PackageJson } from 'type-fest';
import moizeImport, { type Moize } from 'moize';
import {
  resolve as resolvePackageJson,
  resolveSync as resolvePackageJsonSync,
} from './manifest.js';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';

const moize = moizeImport as unknown as Moize;

/**
 * Resolve a path to the package.json file (async)
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolveSync = moize(((
  path: string,
) => {
  const packageJson = resolvePackageJsonSync(path);
  const contents = readJsonSync<PackageJson>(packageJson);
  return contents.workspaces;
})) satisfies PathResolverFunction<PackageJson['workspaces']> as PathResolverFunction<PackageJson['workspaces']>;

/**
 * Resolve a path to the workspaces field of a package.json
 * (async)
 * @param path The path to resolve against
 * @returns The resolved workspaces field
 */
export const resolve = moize.promise((async (
  path: string,
) => {
  const packageJson = await resolvePackageJson(path);
  const contents = await readJson<PackageJson>(packageJson);
  return contents.workspaces;
})) satisfies PathResolverFunctionAsync<PackageJson['workspaces']> as PathResolverFunctionAsync<PackageJson['workspaces']>;

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver<PackageJson['workspaces']>;
