import {
  readJson,
  readJsonSync,
} from '@sabinmarcu/utils-fs';
import moizeImport, { type Moize } from 'moize';

import path from 'node:path';
import type { PackageJson } from 'type-fest';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';
import { walker } from '../../utils/walkFs.js';
import {
  resolver as getWorkspacesPaths,
} from './paths.js';
import { testWorkspaces as test } from '../../predicates/index.js';

const moize = moizeImport as unknown as Moize;

export const getWorkspacesNames = moize.promise(async (
  from: string,
) => {
  const paths = await getWorkspacesPaths.async(from);
  const root = walker.sync(
    from,
    test.sync,
  );
  const names = await Promise.all(paths.map(async (workspace) => {
    const packageJson = await readJson<PackageJson>(
      path.join(root, workspace, 'package.json'),
    );
    return packageJson.name!;
  }));
  return names;
}) satisfies PathResolverFunctionAsync<string[]> as PathResolverFunctionAsync<string[]>;

export const getWorkspacesNamesSync = moize((
  from: string,
) => {
  const paths = getWorkspacesPaths.sync(from);
  const root = walker.sync(
    from,
    test.sync,
  );
  const names = paths.map((workspace) => {
    const packageJson = readJsonSync<PackageJson>(
      path.join(root, workspace, 'package.json'),
    );
    return packageJson.name!;
  });
  return names;
}) satisfies PathResolverFunction<string[]> as PathResolverFunction<string[]>;

export const resolver = {
  async: getWorkspacesNames,
  sync: getWorkspacesNamesSync,
} satisfies PathResolver<string[]>;
