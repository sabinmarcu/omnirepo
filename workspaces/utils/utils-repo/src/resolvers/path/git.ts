// eslint-disable-next-line import/extensions -- Moize's ESM entry requires its .mjs extension.
import moize from 'moize/mjs/index.mjs';
import nodePath from 'node:path';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';

/**
 * Resolve a path to the .git folder
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolveSync = moize((
  path: string,
) => nodePath.resolve(path, '.git')) satisfies PathResolverFunction as PathResolverFunction;

/**
 * Resolve a path to the .git folder (async)
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolve = moize.promise((async (
  path: string,
) => nodePath.resolve(path, '.git')
)) satisfies PathResolverFunctionAsync as PathResolverFunctionAsync;

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
