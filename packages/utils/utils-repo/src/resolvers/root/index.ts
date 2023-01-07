import { resolver as resolveRootViaGit } from './git';
import { resolver as resolveRootViaPackageJson } from './packageJson';
import { resolver as resolveRootViaWorkspaces } from './workspacesRoot';

export { resolver as resolveRootViaGit } from './git';
export { resolver as resolveRootViaPackageJson } from './packageJson';
export { resolver as resolveRootViaWorkspaces } from './workspacesRoot';

export const rootResolver = {
  viaGit: resolveRootViaGit,
  viaPackageJson: resolveRootViaPackageJson,
  viaWorkspaces: resolveRootViaWorkspaces,
} as const;

export const resolveRoot = resolveRootViaWorkspaces.async;
export const resolveRootSync = resolveRootViaWorkspaces.sync;
