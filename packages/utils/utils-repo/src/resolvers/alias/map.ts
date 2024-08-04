import moize from 'moize';
import {
  resolver as getMapping,
} from '../workspace/map';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types';
import { deriveAlias } from '../../utils/deriveAlias';

export const getWorkspacesMap = moize.promise(async (
  from: string,
) => {
  const mapping = await getMapping.async(from);
  return Object.fromEntries(
    Object.entries(mapping).flatMap(
      ([
        name,
        path,
      ]) => {
        const aliases = deriveAlias(name);
        return aliases.map(
          (alias) => [
            alias,
            path,
          ],
        );
      },
    ),
  );
}) as PathResolverFunctionAsync<Record<string, string>>;

export const getWorkspacesMapSync = moize((
  from: string,
) => {
  const mapping = getMapping.sync(from);
  return Object.fromEntries(
    Object.entries(mapping).flatMap(
      ([
        name,
        path,
      ]) => {
        const aliases = deriveAlias(name);
        return aliases.map(
          (alias) => [
            alias,
            path,
          ],
        );
      },
    ),
  );
}) as PathResolverFunction<Record<string, string>>;

export const resolver = {
  async: getWorkspacesMap,
  sync: getWorkspacesMapSync,
} satisfies PathResolver<Record<string, string>>;
