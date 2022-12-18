import moize from 'moize';
import {
  resolve as resolvePath,
} from 'node:path';
import type {
  PathResolver,
  PathResolverFn,
  PathResolverFnAsync,
} from '../../types';

/**
 * Resolve a path to the package.json file
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolveSync = moize(((
  path: string,
) => resolvePath(path, 'package.json')
) satisfies PathResolverFn);

/**
 * Resolve a path to the package.json file (async)
 * @param path The path to resolve against
 * @returns The resolved path to the package.json file
 */
export const resolve = moize.promise((async (
  path: string,
) => resolvePath(path, 'package.json')
) satisfies PathResolverFnAsync);

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
