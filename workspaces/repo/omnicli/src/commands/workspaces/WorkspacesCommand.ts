import {
  Command,
  Option,
} from 'clipanion';
import { getWorkspacesPaths } from '@sabinmarcu/utils-repo';
import type { ContextWithCwd } from '../../features/index.js';
import {
  matchSubcommand,
} from '../workspaceCommands.js';

export class WorkspacesCommand extends Command<ContextWithCwd> {
  static paths = [['workspaces']];

  rest = Option.Proxy();

  async execute() {
    const {
      context,
      rest,
      cli,
    } = this;

    const [
      commandPath,
      commandArguments,
    ] = matchSubcommand(rest);

    const workspacesPaths = await getWorkspacesPaths.async(context.cwd);

    await Promise.all(
      workspacesPaths.map(async (workspacePath) => (
        cli.run([
          ...commandPath,
          workspacePath,
          ...commandArguments,
        ])
      )),
    );
  }
}
