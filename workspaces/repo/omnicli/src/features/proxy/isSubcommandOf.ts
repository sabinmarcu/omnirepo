import type { SubcommandType } from '../command';
import { compileSubcommandsMap } from './compileSubcommandsMap';

export const isSubcommandOf = <
  Subcommands extends readonly SubcommandType[],
>(
  subcommands: Subcommands,
) => {
  const subcommandsMap = compileSubcommandsMap(subcommands);
  return (subcommand: string): subcommand is keyof typeof subcommandsMap => (
    subcommand in subcommandsMap
  );
};
