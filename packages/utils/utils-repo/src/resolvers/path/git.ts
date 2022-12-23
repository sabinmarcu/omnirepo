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
 * Resolve a path to the .git folder
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolveSync = moize(((
  path: string,
) => resolvePath(path, '.git')
) satisfies PathResolverFunction);

/**
 * Resolve a path to the .git folder (async)
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolve = moize.promise((async (
  path: string,
) => resolvePath(path, '.git')
) satisfies PathResolverFunctionAsync);

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
