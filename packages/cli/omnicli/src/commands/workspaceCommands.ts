import { FixExportsCommand } from './fixExports';
import type { SubcommandType } from '../features';
import {
  compileSubcommandsMap,
  isSubcommandOf,
} from '../features';

export const subcommands = [
  FixExportsCommand,
] satisfies SubcommandType[];

export const subcommandsMap = compileSubcommandsMap(subcommands);
export const isValidSubcommand = isSubcommandOf(subcommands);
