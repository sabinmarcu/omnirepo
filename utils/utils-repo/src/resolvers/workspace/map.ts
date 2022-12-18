import { zipObj } from 'ramda';
import moize from 'moize';
import {
  getWorkspacesPaths,
  getWorkspacesPathsSync,
} from './paths';
import {
  getWorkspacesNames,
  getWorkspacesNamesSync,
} from './names';

export const getWorkspacesMap = moize.promise(async (
  from: string,
) => {
  const paths = await getWorkspacesPaths(from);
  const names = await getWorkspacesNames(from);
  return zipObj(names, paths);
});

export const getWorkspacesMapSync = moize((
  from: string,
) => {
  const paths = getWorkspacesPathsSync(from);
  const names = getWorkspacesNamesSync(from);
  return zipObj(names, paths);
});
