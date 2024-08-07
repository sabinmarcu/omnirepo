import { resolver as getWorkspacesPaths } from './paths.js';
import { resolver as getWorkspacesNames } from './names.js';
import { resolver as getWorkspacesMap } from './map.js';

export { resolver as getWorkspacesPaths } from './paths.js';
export { resolver as getWorkspacesNames } from './names.js';
export { resolver as getWorkspacesMap } from './map.js';

export const getWorkspaces = {
  paths: getWorkspacesPaths,
  names: getWorkspacesNames,
  map: getWorkspacesMap,
};
