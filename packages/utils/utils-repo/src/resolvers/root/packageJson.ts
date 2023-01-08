import moize from 'moize';
import { 
  predicate as testPath
} from '../../predicates/manifest';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types';
import { walker } from '../../utils/walkFs';

/**
 * Resolve a path to the .git folder
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolveSync = moize(((
  path: string,
) => walker.sync(path, testPath.sync)
) satisfies PathResolverFunction);

/**
 * Resolve a path to the .git folder (async)
 * @param path The path to resolve against
 * @returns The resolved path to the .git folder
 */
export const resolve = moize.promise((async (
  path: string,
) => walker.async(path, testPath.async)
) satisfies PathResolverFunctionAsync);

export const resolver = {
  sync: resolveSync,
  async: resolve,
} satisfies PathResolver;
