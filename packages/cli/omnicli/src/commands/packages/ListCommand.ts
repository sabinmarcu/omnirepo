import {
  Command,
  Option,
} from 'clipanion';
import {
  getWorkspacesMap,
  getWorkspacesNames,
  getWorkspacesPaths,
} from '@sabinmarcu/utils-repo';
import { commandPath } from './path';

const getters = {
  // eslint-disable-next-line unicorn/no-await-expression-member
  names: async () => (await getWorkspacesNames.async(process.cwd())).join('\n'),
  // eslint-disable-next-line unicorn/no-await-expression-member
  paths: async () => (await getWorkspacesPaths.async(process.cwd())).join('\n'),
  map: async () => Object.entries((await getWorkspacesMap.async(process.cwd())))
    .map(([name, path]) => ({ name, path }))
    .map((set) => JSON.stringify(set))
    .join('\n'),
};

const onlyParameterValid = (only?: string): only is 'names' | 'paths' => (
  only
    ? ['names', 'paths'].includes(only)
    : false
);

export class ListPackagesCommand extends Command {
  static paths = [
    commandPath('list'),
  ];

  only = Option.String('--only');

  static usage = Command.Usage({
    category: 'Packages',
    description: 'List all packages',
  });

  async execute() {
    const { only, context } = this;
    const getter = onlyParameterValid(only) ? getters[only] : getters.map;
    context.stdout.write(
      await getter(),
    );
  }
}
