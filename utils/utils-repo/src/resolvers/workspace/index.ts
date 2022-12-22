import { resolver as getWorkspacesPaths } from './paths';
import { resolver as getWorkspacesNames } from './names';
import { resolver as getWorkspacesMap } from './map';

export { resolver as getWorkspacesPaths } from './paths';
export { resolver as getWorkspacesNames } from './names';
export { resolver as getWorkspacesMap } from './map';

export const getWorkspaces = {
  paths: getWorkspacesPaths,
  names: getWorkspacesNames,
  map: getWorkspacesMap,
};
