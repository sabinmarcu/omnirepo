import {
  exists,
  existsSync,
} from '@sabinmarcu/utils-fs';
import moizeImport, { type Moize } from 'moize';
import {
  resolve,
  resolveSync,
} from '../resolvers/path/git.js';
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
) => existsSync(
  resolveSync(path),
))) satisfies PathPredicateFunction as PathPredicateFunction;

/**
 * Determine if a path is a git root (async)
 * @param path The path to resolve against
 * @returns A boolean indicating if the path is a git root
 */
export const test = moize.promise((async (
  path: string,
) => exists(
  await resolve(path),
))) satisfies PathPredicateFunctionAsync as PathPredicateFunctionAsync;

/**
 * Resolver set for git roots
 */
export const predicate = {
  sync: testSync,
  async: test,
} satisfies PathPredicate;
