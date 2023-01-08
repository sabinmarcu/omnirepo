import moize from 'moize';
import type {
  MapOfSubcommandsList,
} from './types';
import type { SubcommandType } from '../command/types';
import { getSinglePathsOf } from '../paths/getSinglePathsOf';

export const compileSubcommandsMap = moize(
  <
    Subcommands extends readonly SubcommandType[],
  >(
    subcommands: Subcommands,
  ): MapOfSubcommandsList<Subcommands> => (
    Object.fromEntries(
      subcommands.flatMap((subcommand) => {
        const paths = getSinglePathsOf(subcommand.readonlyPaths);
        return paths.map((path) => [path, subcommand]);
      }),
    ) as any
  ),
);
