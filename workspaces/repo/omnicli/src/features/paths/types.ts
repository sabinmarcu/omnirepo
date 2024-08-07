import type { Join } from 'type-fest';
import type { SubcommandType } from '../command/types.ts';
import type { singlePathSeparator } from './constants.js';

export type SinglePathSeparator = typeof singlePathSeparator;
export type ReadonlyPaths = Readonly<Array<Readonly<Array<string>>>>;

export type SinglePathOf<
  Paths extends ReadonlyPaths[number],
> = Paths extends readonly [ infer Path ]
  ? Path
  : Join<[...Paths], SinglePathSeparator>;

export type SinglePathsOf<
  Paths extends ReadonlyPaths,
> = Paths extends readonly [
  infer PathSet extends ReadonlyPaths[number],
  ...infer Rest extends ReadonlyPaths[number][],
]
  ? SinglePathOf<PathSet> | SinglePathsOf<Rest>
  : Paths extends [infer Path extends ReadonlyPaths[number]]
    ? SinglePathOf<Path>
    : never;

export type PrimaryPathsOfCommand<
  Command extends SubcommandType,
  Paths = Command['readonlyPaths'],
> = Paths extends ReadonlyPaths
  ? SinglePathsOf<Paths>
  : never;