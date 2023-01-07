import {
  Command,
  Option,
} from 'clipanion';
import { getAliasesMap } from '@sabinmarcu/utils-repo';
import type { ContextWithCwd } from '../../features';
import {
  isValidSubcommand,
} from '../workspaceCommands';

export class WorkspaceCommand extends Command<ContextWithCwd> {
  static paths = [['workspace']];

  workspaceName = Option.String();

  commandName = Option.String();

  rest = Option.Proxy();

  async execute() {
    const {
      context,
      workspaceName,
      commandName,
      rest,
      cli,
    } = this;

    const aliasMapping = await getAliasesMap.async(context.cwd);

    const workspacePath = aliasMapping[workspaceName];

    if (!workspacePath) {
      throw new Error('Workspace not found');
    }

    if (!isValidSubcommand(commandName)) {
      throw new Error('Invalid subcommand');
    }

    cli.run([
      commandName,
      workspacePath,
      ...rest,
    ]);
  }
}
