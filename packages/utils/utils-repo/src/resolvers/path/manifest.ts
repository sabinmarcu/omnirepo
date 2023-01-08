import moize from 'moize';
import {
  resolve as resolvePath,
} from 'node:path';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types';

/**
 * Resolve a path to the package.json file
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolveSync = moize(((
  path: string,
) => resolvePath(path, 'package.json')
) satisfies PathResolverFunction);

/**
 * Resolve a path to the package.json file (async)
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolve = moize.promise((async (
  path: string,
) => resolvePath(path, 'package.json')
) satisfies PathResolverFunctionAsync);

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
