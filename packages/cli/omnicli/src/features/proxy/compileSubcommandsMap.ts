import moize from 'moize';
import type {
  MapOfSubcommandsList,
} from './types';
import { getSinglePathsOf } from '../paths';
import type { SubcommandType } from '../command/types';

export const compileSubcommandsMap = moize(
  <
    Subcommands extends readonly SubcommandType[],
  >(
    subcommands: Subcommands,
  ): MapOfSubcommandsList<Subcommands> => (
    Object.fromEntries(
      subcommands.flatMap((subcommand) => {
        const singlePaths = getSinglePathsOf(subcommand.paths || []) as any[];
        return singlePaths.map((singlePath) => [singlePath, subcommand]);
      }),
    )
  ),
);
