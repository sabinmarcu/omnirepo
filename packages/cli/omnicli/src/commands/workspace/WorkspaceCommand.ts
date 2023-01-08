import {
  Command,
  Option,
} from 'clipanion';
import { getAliasesMap } from '@sabinmarcu/utils-repo';
import type { ContextWithCwd } from '../../features';
import {
  matchSubcommand,
} from '../workspaceCommands';

export class WorkspaceCommand extends Command<ContextWithCwd> {
  static paths = [['workspace']];

  workspaceName = Option.String();

  rest = Option.Proxy();

  async execute() {
    const {
      context,
      workspaceName,
      rest,
      cli,
    } = this;

    const aliasMapping = await getAliasesMap.async(context.cwd);

    const workspacePath = aliasMapping[workspaceName];

    if (!workspacePath) {
      throw new Error('Workspace not found');
    }

    const [commandPath, commandArguments] = matchSubcommand(rest);

    cli.run([
      ...commandPath,
      workspacePath,
      ...commandArguments,
    ]);
  }
}
