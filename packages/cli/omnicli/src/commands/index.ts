import { Builtins } from 'clipanion';

import { HelloCommand } from './HelloCommand';

import { WorkspaceCommand } from './workspace';
import { FixExportsCommand } from './fixExports';
import { WorkspacesCommand } from './workspaces';

export const commands = [
  Builtins.DefinitionsCommand,
  Builtins.HelpCommand,
  Builtins.VersionCommand,
  HelloCommand,
  FixExportsCommand,
  WorkspaceCommand,
  WorkspacesCommand,
];
