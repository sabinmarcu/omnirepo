import { singlePathSeparator } from './constants.js';
import type {
  ReadonlyPaths,
  SinglePathOf,
} from './types.js';

export const getSinglePathOf = <
  Path extends ReadonlyPaths[number],
>(
  path: Path,
): SinglePathOf<Path> => {
  if (path.length === 1) {
    return path[0] as any;
  }
  return path.join(singlePathSeparator) as SinglePathOf<Path>;
};
