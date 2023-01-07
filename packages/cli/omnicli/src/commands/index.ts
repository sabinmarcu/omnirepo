import { Builtins } from 'clipanion';
import { HelloCommand } from './HelloCommand';

import { FixExportsCommand } from './fixExports';
export const commands = [
  Builtins.DefinitionsCommand,
  Builtins.HelpCommand,
  Builtins.VersionCommand,
  HelloCommand,
  FixExportsCommand,
];
