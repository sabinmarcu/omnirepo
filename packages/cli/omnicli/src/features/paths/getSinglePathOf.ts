import type {
  ReadonlyPaths,
  SinglePathOf,
} from './types';

export const getSinglePathOf = <
  Path extends ReadonlyPaths[number],
>(
  path: Path,
): SinglePathOf<Path> => {
  if (path.length === 1) {
    return path[0] as any;
  }
  return undefined as any;
};
