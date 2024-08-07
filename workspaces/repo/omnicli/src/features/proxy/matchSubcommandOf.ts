import moizeImport, { type Moize } from 'moize';
import type { SubcommandType } from '../command/types.js';
import { matchPath } from '../paths/matchPath.js';
import { unpackSinglePath } from '../paths/unpackSinglePath.js';
import type { MapOfSubcommandsList } from './types.js';

const moize = moizeImport as unknown as Moize;

export const matchSubcommandOf = moize(
  <
    Subcommands extends readonly SubcommandType[],
  >(
    subcommands: Subcommands,
  ) => {
    const subcommandsPaths = subcommands.map((subcommand) => subcommand.readonlyPaths);
    return (subcommandArguments: readonly string[]) => {
      const matches = subcommandsPaths.map(
        (set) => {
          const result = matchPath(set, subcommandArguments);
          return result;
        },
      ).filter(Boolean) as any as [keyof MapOfSubcommandsList<Subcommands>, string[]][];
      if (matches.length !== 1) {
        throw new Error(`Unknown command: ${subcommandArguments.join(' ')}`);
      }
      const [
        [
          subcommand,
          rest,
        ],
      ] = matches;
      return [
        unpackSinglePath(subcommand),
        rest,
      ] as const;
    };
  },
);
