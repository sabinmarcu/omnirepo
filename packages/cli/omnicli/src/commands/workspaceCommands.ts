import { FixExportsCommand } from './fixExports';
import type { SubcommandType } from '../features';
import {
  compileSubcommandsMap,
  isSubcommandOf,
} from '../features';
import { FixMoonDependsOnCommand } from './fixMoonDependsOn/FixMoonDependsOnCommand';
import { matchSubcommandOf } from '../features/proxy/matchSubcommandOf';

export const subcommands = [
  FixExportsCommand,
  FixMoonDependsOnCommand,
]satisfies SubcommandType[];

export const subcommandsMap = compileSubcommandsMap(subcommands);
export const isValidSubcommand = isSubcommandOf(subcommands);
export const matchSubcommand = matchSubcommandOf(subcommands);
