import glob from 'glob';
import path from 'node:path';
import moizeImport, { type Moize } from 'moize';
import { promisify } from 'node:util';
import { testWorkspaces as test } from '../../predicates/index.js';
import { walker } from '../../utils/walkFs.js';
import { resolveWorkspaces as resolve } from '../path/index.js';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';

const moize = moizeImport as unknown as Moize;
const globPromisified = promisify(glob);

export const getWorkspacesPaths = moize.promise(async (
  from: string,
) => {
  let root: string;
  let workspacesList: string[];
  try {
    root = await walker.async(
      from,
      test.async,
    );
    const workspaces = await resolve.async(root);
    const parsedWorkspaces = Array.isArray(workspaces)
      ? workspaces
      : workspaces!.packages;
    if (!(parsedWorkspaces && Array.isArray(parsedWorkspaces))) {
      throw new Error('Workspaces field invalid');
    }
    workspacesList = parsedWorkspaces;
  } catch (error) {
    throw new Error('No workspaces found', { cause: error });
  }
  const packageJsonListMap = await Promise.all(
    workspacesList.map(
      async (workspace) => globPromisified(
        path.join(workspace, 'package.json'),
        { cwd: root },
      ),
    ),
  );
  const packageJsonList = packageJsonListMap.flat();
  return packageJsonList.map((it) => it.replace(/\/package\.json$/, ''));
}) satisfies PathResolverFunctionAsync<string[]> as PathResolverFunctionAsync<string[]>;

export const getWorkspacesPathsSync = moize((
  from: string,
) => {
  let root: string;
  let workspacesList: string[];
  try {
    root = walker.sync(
      from,
      test.sync,
    );
    const workspaces = resolve.sync(root);
    const parsedWorkspaces = Array.isArray(workspaces)
      ? workspaces
      : workspaces!.packages;
    if (!(parsedWorkspaces && Array.isArray(parsedWorkspaces))) {
      throw new Error('Workspaces field invalid');
    }
    workspacesList = parsedWorkspaces;
  } catch (error) {
    throw new Error('No workspaces found', { cause: error });
  }
  const packageJsonList = workspacesList.flatMap(
    (workspace) => glob.sync(
      path.join(workspace, 'package.json'),
      { cwd: root },
    ),
  );
  return packageJsonList.map((it) => it.replace(/\/package\.json$/, ''));
}) satisfies PathResolverFunction<string[]> as PathResolverFunction<string[]>;

export const resolver = {
  async: getWorkspacesPaths,
  sync: getWorkspacesPathsSync,
} satisfies PathResolver<string[]>;
