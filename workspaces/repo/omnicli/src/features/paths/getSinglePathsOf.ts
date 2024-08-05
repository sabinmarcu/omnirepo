import { getSinglePathOf } from './getSinglePathOf';
import type {
  ReadonlyPaths,
  SinglePathsOf,
} from './types';

export const getSinglePathsOf = <
  Paths extends ReadonlyPaths,
>(
  paths: Paths,
): SinglePathsOf<Paths> => (
  paths.map((path) => getSinglePathOf(path))
    .filter(Boolean) as any
);
