import { FixExportsCommand } from './fixExports/index.js';
import type { SubcommandType } from '../features/index.js';
import {
  compileSubcommandsMap,
  isSubcommandOf,
} from '../features/index.js';
import { FixMoonDependsOnCommand } from './fixMoonDependsOn/FixMoonDependsOnCommand.js';
import { matchSubcommandOf } from '../features/proxy/matchSubcommandOf.js';

export const subcommands = [
  FixExportsCommand,
  FixMoonDependsOnCommand,
]satisfies SubcommandType[];

export const subcommandsMap = compileSubcommandsMap(subcommands);
export const isValidSubcommand = isSubcommandOf(subcommands);
export const matchSubcommand = matchSubcommandOf(subcommands);
