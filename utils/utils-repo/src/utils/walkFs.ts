import path from 'node:path';
import type {
  PathPredicateFunction,
  PathPredicateFunctionAsync,
  PathWalker,
  PathWalkerFunction,
  PathWalkerFunctionAsync,
  PathWalkerProcessFunction,
} from '../types';
import { fsRoot } from '../constants';

/**
 * Walk the filesystem up from a path, checking each path against a predicate (async)
 * @param pathToCheck Path to be checked against predicate
 * @param predicate Predicate to check path with
 * @param process Optional function to process path output
 * @returns Path that matched predicate
 */
export const walkFs = (async <T = string>(
  pathToCheck: string,
  predicate: PathPredicateFunctionAsync,
  process?: PathWalkerProcessFunction<T>,
): Promise<T | string> => {
  if (pathToCheck === fsRoot) {
    throw new Error('Reached root, no match found');
  }
  if (await predicate(pathToCheck)) {
    if (process) {
      return process(pathToCheck);
    }
    return pathToCheck;
  }
  return walkFs(
    path.dirname(pathToCheck),
    predicate,
  );
}) satisfies PathWalkerFunctionAsync;

/**
 * Walk the filesystem up from a path, checking each path against a predicate
 * @param pathToCheck Path to be checked against predicate
 * @param predicate Predicate to check path with
 * @param process Optional function to process path output
 * @returns Path that matched predicate
 */
export const walkFsSync = (<T = string>(
  pathToCheck: string,
  predicate: PathPredicateFunction,
  process?: PathWalkerProcessFunction<T>,
): T | string => {
  if (pathToCheck === fsRoot) {
    throw new Error('Reached root, no match found');
  }
  if (predicate(pathToCheck)) {
    if (process) {
      return process(pathToCheck);
    }
    return pathToCheck;
  }
  return walkFsSync(
    path.dirname(pathToCheck),
    predicate,
  );
}) satisfies PathWalkerFunction;

export const walker = {
  async: walkFs,
  sync: walkFsSync,
} satisfies PathWalker;
