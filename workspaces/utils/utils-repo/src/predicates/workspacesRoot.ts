import moizeImport, { type Moize } from 'moize';
import {
  resolve,
  resolveSync,
} from '../resolvers/path/workspacesRoot.js';
import {
  test as testPackage,
  testSync as testPackageSync,
} from './manifest.js';
import type {
  PathPredicate,
  PathPredicateFunction,
  PathPredicateFunctionAsync,
} from '../types.js';

const moize = moizeImport as unknown as Moize;

/**
 * Determine if a path is a git root
 * @param path The path to resolve against
 * @returns A boolean indicating if the path is a git root
 */
export const testSync = moize(((
  path: string,
) => {
  if (!testPackageSync(path)) {
    return false;
  }
  return Boolean(resolveSync(path));
})) satisfies PathPredicateFunction as PathPredicateFunction;

/**
 * Determine if a path is a git root (async)
 * @param path The path to resolve against
 * @returns A boolean indicating if the path is a git root
 */
export const test = moize.promise((async (
  path: string,
) => {
  if (!await testPackage(path)) {
    return false;
  }
  return Boolean(await resolve(path));
})) satisfies PathPredicateFunctionAsync as PathPredicateFunctionAsync;

/**
 * Resolver set for git roots
 */
export const predicate = {
  sync: testSync,
  async: test,
} satisfies PathPredicate;
