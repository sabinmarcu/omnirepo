import { Builtins } from 'clipanion';
import { HelloCommand } from './HelloCommand';
import { ListPackagesCommand } from './packages/ListCommand';

export const commands = [
  Builtins.DefinitionsCommand,
  Builtins.HelpCommand,
  Builtins.VersionCommand,
  HelloCommand,
  ListPackagesCommand,
];
