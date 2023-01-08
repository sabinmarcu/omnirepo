import path from 'node:path';
import { workspaceDependenciesOf } from '@sabinmarcu/utils-repo';
import {
  readFile,
  writeFile,
} from 'node:fs/promises';
import {
  Option,
} from 'clipanion';
import {
  parse,
  stringify,
} from 'yaml';
import type { ContextWithCwd } from '../../features';
import { OmnicliCommand } from '../../features';

export class FixMoonDependsOnCommand extends OmnicliCommand<ContextWithCwd> {
  static readonlyPaths = [['fix', 'moon', 'dependsOn']];

  workspacePath = Option.String({ required: false });

  dryRun = Option.Boolean('--dry-run,-n');

  async execute() {
    const {
      context,
      dryRun,
      workspacePath,
    } = this;

    const localWorkspacePath = workspacePath ?? context.cwd;

    const moonManifestPath = path.join(localWorkspacePath, 'moon.yml');
    if (!moonManifestPath) {
      throw new Error(`No moon manifest found at path ${localWorkspacePath}`);
    }

    const workspaceDependencies = await workspaceDependenciesOf(localWorkspacePath);

    const moonManifestContents = await readFile(moonManifestPath, 'utf8');

    const moonManifest = parse(moonManifestContents);

    moonManifest.dependsOn = Object.keys(workspaceDependencies);

    const resultManifest = stringify(moonManifest);

    if (dryRun) {
      context.stdout.write(`${resultManifest}\n`);
    } else {
      await writeFile(
        moonManifestPath,
        resultManifest,
        'utf8',
      );
    }
  }
}
