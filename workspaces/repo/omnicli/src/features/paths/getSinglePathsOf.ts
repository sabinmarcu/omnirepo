import { getSinglePathOf } from './getSinglePathOf.js';
import type {
  ReadonlyPaths,
  SinglePathsOf,
} from './types.js';

export const getSinglePathsOf = <
  Paths extends ReadonlyPaths,
>(
  paths: Paths,
): SinglePathsOf<Paths> => (
  paths.map((path) => getSinglePathOf(path))
    .filter(Boolean) as any
);
