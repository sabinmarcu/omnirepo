import moizeImport, { type Moize } from 'moize';
import nodePath from 'node:path';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';

const moize = moizeImport as unknown as Moize;

/**
 * Resolve a path to the package.json file
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolveSync = moize(((
  path: string,
) => nodePath.resolve(path, 'package.json')
)) satisfies PathResolverFunction as PathResolverFunction;

/**
 * Resolve a path to the package.json file (async)
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolve = moize.promise((async (
  path: string,
) => nodePath.resolve(path, 'package.json')
)) satisfies PathResolverFunctionAsync as PathResolverFunctionAsync;

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
