import { resolver as resolveRootViaGit } from './git.js';
import { resolver as resolveRootViaPackageJson } from './packageJson.js';
import { resolver as resolveRootViaWorkspaces } from './workspacesRoot.js';

export { resolver as resolveRootViaGit } from './git.js';
export { resolver as resolveRootViaPackageJson } from './packageJson.js';
export { resolver as resolveRootViaWorkspaces } from './workspacesRoot.js';

export const rootResolver = {
  viaGit: resolveRootViaGit,
  viaPackageJson: resolveRootViaPackageJson,
  viaWorkspaces: resolveRootViaWorkspaces,
} as const;

export const resolveRoot = resolveRootViaWorkspaces.async;
export const resolveRootSync = resolveRootViaWorkspaces.sync;
