import { zipObj } from 'ramda';
import moize from 'moize';
import {
  resolver as getWorkspacesPaths,
} from './paths';
import {
  resolver as getWorkspacesNames,
} from './names';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types';

export const getWorkspacesMap = moize.promise(async (
  from: string,
) => {
  const paths = await getWorkspacesPaths.async(from);
  const names = await getWorkspacesNames.async(from);
  return zipObj(names, paths);
}) satisfies PathResolverFunctionAsync<Record<string, string>>;

export const getWorkspacesMapSync = moize((
  from: string,
) => {
  const paths = getWorkspacesPaths.sync(from);
  const names = getWorkspacesNames.sync(from);
  return zipObj(names, paths);
}) satisfies PathResolverFunction<Record<string, string>>;

export const resolver = {
  async: getWorkspacesMap,
  sync: getWorkspacesMapSync,
} satisfies PathResolver<Record<string, string>>;
