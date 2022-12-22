import glob from 'glob';
import util from 'node:util';
import path from 'node:path';
import moize from 'moize';
import { testWorkspaces as test } from '../../predicates/index';
import { walker } from '../../utils/walkFs';
import { resolveWorkspaces as resolve } from '../path/index';

const globPromised = util.promisify(glob);

export const getWorkspacesPaths = moize.promise(async (
  from: string,
) => {
  const root = await walker.async(
    from,
    test.async,
  );
  const workspaces = await resolve.async(root);
  const workspacesList = Array.isArray(workspaces)
    ? workspaces
    : workspaces?.packages;
  if (!workspacesList) {
    throw new Error('No workspaces found');
  }
  const packageJsonListMap = await Promise.all(
    workspacesList.map(
      (workspace) => globPromised(
        path.join(workspace, 'package.json'),
      ),
    ),
  );
  const packageJsonList = packageJsonListMap.flat();
  return packageJsonList.map((it) => it.replace(/\/package\.json$/, ''));
});

export const getWorkspacesPathsSync = moize((
  from: string,
) => {
  const root = walker.sync(
    from,
    test.sync,
  );
  const workspaces = resolve.sync(root);
  const workspacesList = Array.isArray(workspaces)
    ? workspaces
    : workspaces?.packages;
  if (!workspacesList) {
    throw new Error('No workspaces found');
  }
  const packageJsonList = workspacesList.flatMap(
    (workspace) => glob.sync(
      path.join(workspace, 'package.json'),
    ),
  );
  return packageJsonList.map((it) => it.replace(/\/package\.json$/, ''));
});
