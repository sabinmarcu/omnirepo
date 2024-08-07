import { Builtins } from 'clipanion';

import { HelloCommand } from './HelloCommand.js';

import { WorkspaceCommand } from './workspace/index.js';
import { FixExportsCommand } from './fixExports/index.js';
import { WorkspacesCommand } from './workspaces/index.js';
import { FixMoonDependsOnCommand } from './fixMoonDependsOn/FixMoonDependsOnCommand.js';

export const commands = [
  Builtins.DefinitionsCommand,
  Builtins.HelpCommand,
  Builtins.VersionCommand,
  HelloCommand,
  FixExportsCommand,
  FixMoonDependsOnCommand,
  WorkspaceCommand,
  WorkspacesCommand,
];