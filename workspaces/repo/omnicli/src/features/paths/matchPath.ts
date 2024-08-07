import { getSinglePathOf } from './getSinglePathOf.js';
import type {
  ReadonlyPaths,
  SinglePathsOf,
} from './types.js';

export const matchPath = <
  Match extends ReadonlyPaths,
  Input extends ReadonlyPaths[number],
>(
  options: Match,
  input: Input,
): readonly [SinglePathsOf<Match>, string[]] | undefined => {
  const match = options.find((option) => {
    for (const [index, section] of option.entries()) {
      if (section !== input[index]) {
        return false;
      }
    }
    return true;
  });
  if (!match) {
    return undefined;
  }
  return [
    getSinglePathOf(match) as any,
    input.slice(match.length),
  ] as const;
};
