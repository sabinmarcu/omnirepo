import {
  Command,
  Option,
} from 'clipanion';
import { getWorkspacesPaths } from '@sabinmarcu/utils-repo';
import type { ContextWithCwd } from '../../features';
import {
  isValidSubcommand,
} from '../workspaceCommands';

export class WorkspacesCommand extends Command<ContextWithCwd> {
  static paths = [['workspaces']];

  commandName = Option.String();

  rest = Option.Proxy();

  async execute() {
    const {
      context,
      commandName,
      rest,
      cli,
    } = this;

    if (!isValidSubcommand(commandName)) {
      throw new Error('Invalid subcommand');
    }

    const workspacesPaths = await getWorkspacesPaths.async(context.cwd);

    await Promise.all(
      workspacesPaths.map(async (workspacePath) => (
        cli.run([
          commandName,
          workspacePath,
          ...rest,
        ])
      )),
    );
  }
}
