// eslint-disable-next-line import/extensions -- Moize's ESM entry requires its .mjs extension.
import moize from 'moize/mjs/index.mjs';
import type {
  MapOfSubcommandsList,
} from './types.js';
import type { SubcommandType } from '../command/types.js';
import { getSinglePathsOf } from '../paths/getSinglePathsOf.js';

const compileSubcommandsMapRaw = <
  Subcommands extends readonly SubcommandType[],
>(
    subcommands: Subcommands,
  ): MapOfSubcommandsList<Subcommands> => (
    Object.fromEntries(
      subcommands.flatMap((subcommand) => {
        const paths = getSinglePathsOf(subcommand.readonlyPaths) as string[];
        return paths.map((path) => [
          path,
          subcommand,
        ]);
      }),
    ) as any
  );

export const compileSubcommandsMap = moize(
  compileSubcommandsMapRaw,
) as typeof compileSubcommandsMapRaw;
