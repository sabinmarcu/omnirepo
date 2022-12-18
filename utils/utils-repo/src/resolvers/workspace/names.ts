import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
import moize from 'moize';
import path from 'node:path';
import type { PackageJson } from 'type-fest';
import {
  getWorkspacesPaths,
  getWorkspacesPathsSync,
} from './paths';

export const getWorkspacesNames = moize.promise(async (
  from: string,
) => {
  const paths = await getWorkspacesPaths(from);
  const names = await Promise.all(paths.map(async (workspace) => {
    const packageJson = await readJson<PackageJson>(
      path.resolve(workspace, 'package.json'),
    );
    return packageJson.name!;
  }));
  return names;
});

export const getWorkspacesNamesSync = moize((
  from: string,
) => {
  const paths = getWorkspacesPathsSync(from);
  const names = paths.map((workspace) => {
    const packageJson = readJsonSync<PackageJson>(
      path.resolve(workspace, 'package.json'),
    );
    return packageJson.name!;
  });
  return names;
});
