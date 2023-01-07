import type { SubcommandType } from '../command/types';

export type ReadonlyPaths = Readonly<Array<Readonly<Array<string>>>>;

export type SinglePathOf<
  Paths extends ReadonlyPaths[number],
> = Paths extends readonly [ infer Path ]
  ? Path
  : never;

export type SinglePathsOf<
  Paths extends ReadonlyPaths,
> = Paths extends readonly [
  infer PathSet extends ReadonlyPaths[number],
  ...infer Rest extends ReadonlyPaths[number][],
]
  ? SinglePathOf<PathSet> | SinglePathsOf<Rest>
  : never;

export type PrimaryPathsOfCommand<
  Command extends SubcommandType,
  Paths = Command['readonlyPaths'],
> = Paths extends ReadonlyPaths
  ? SinglePathsOf<Paths>
  : never;
