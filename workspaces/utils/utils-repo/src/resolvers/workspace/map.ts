import { zipObj } from 'ramda';
import moizeImport, { type Moize } from 'moize';
import {
  resolver as getWorkspacesPaths,
} from './paths.js';
import {
  resolver as getWorkspacesNames,
} from './names.js';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types.js';

const moize = moizeImport as unknown as Moize;

export const getWorkspacesMap = moize.promise(async (
  from: string,
) => {
  const paths = await getWorkspacesPaths.async(from);
  const names = await getWorkspacesNames.async(from);
  return zipObj(names, paths);
// eslint-disable-next-line max-len
}) satisfies PathResolverFunctionAsync<Record<string, string>> as PathResolverFunctionAsync<Record<string, string>>;

export const getWorkspacesMapSync = moize((
  from: string,
) => {
  const paths = getWorkspacesPaths.sync(from);
  const names = getWorkspacesNames.sync(from);
  return zipObj(names, paths);
// eslint-disable-next-line max-len
}) satisfies PathResolverFunction<Record<string, string>> as PathResolverFunction<Record<string, string>>;

export const resolver = {
  async: getWorkspacesMap,
  sync: getWorkspacesMapSync,
} satisfies PathResolver<Record<string, string>>;
