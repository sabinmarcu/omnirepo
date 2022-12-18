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
 * Resolve a path to the .git folder
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolveSync = moize(((
  path: string,
) => resolvePath(path, '.git')
) satisfies PathResolverFn);

/**
 * Resolve a path to the .git folder (async)
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolve = moize.promise((async (
  path: string,
) => resolvePath(path, '.git')
) satisfies PathResolverFnAsync);

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
