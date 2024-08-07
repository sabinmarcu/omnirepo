import {
  Option,
} from 'clipanion';
import fs from 'node:fs/promises';
import {
  manifestOf,
  resolveManifest,
} from '@sabinmarcu/utils-repo';
import type { ContextWithCwd } from '../../features/index.js';
import { OmnicliCommand } from '../../features/index.js';
import { fixPathMapping } from './utils/fixPathMapping.js';

export class FixExportsCommand extends OmnicliCommand<ContextWithCwd> {
  static readonlyPaths = [
    [
      'fix',
      'exports',
    ],
  ];

  workspacePath = Option.String({ required: false });

  devMode = Option.Boolean('--dev,-d');

  dryRun = Option.Boolean('--dry-run,-n');

  async execute() {
    const {
      context,
      devMode,
      dryRun,
      workspacePath,
    } = this;

    const extensionsMapping = devMode
      ? {
        cjs: '.ts',
        esm: '.ts',
        dts: '.ts',
      }
      : {
        cjs: '.cjs',
        esm: '.mjs',
        dts: '.d.ts',
      };

    const localWorkspacePath = workspacePath ?? context.cwd;

    const fixPath = fixPathMapping(extensionsMapping);
    const packageJsonPath = await resolveManifest.sync(localWorkspacePath);
    const packageJson = await manifestOf(localWorkspacePath);

    const fixedPackageJson = {
      ...packageJson,
      main: fixPath.cjs('./cjs/index'),
      module: fixPath.esm('./esm/index'),
      types: fixPath.dts('./esm/index'),
      exports: {
        '.': {
          import: fixPath.esm('./esm/index.js'),
          require: fixPath.cjs('./cjs/index'),
          types: fixPath.dts('./esm/index'),
        },
        './src/*': {
          import: './src/*.js',
          require: './src/*',
        },
        './*': {
          import: fixPath.esm('./esm/*.js'),
          require: fixPath.cjs('./cjs/*'),
          types: fixPath.dts('./esm/*'),
        },
        './package.json': './package.json',
      },
    };

    if (dryRun) {
      context.stdout.write(`${JSON.stringify({
        path: packageJsonPath,
        packageJson: fixedPackageJson,
      }, undefined, 2)}\n`);
    } else {
      await fs.writeFile(
        packageJsonPath,
        `${JSON.stringify(fixedPackageJson, undefined, 2)}\n`,
        'utf8',
      );
    }
  }
}
