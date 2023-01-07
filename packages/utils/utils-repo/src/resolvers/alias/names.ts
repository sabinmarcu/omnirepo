import moize from 'moize';
import type {
  PathResolver,
  PathResolverFunction,
  PathResolverFunctionAsync,
} from '../../types';
import {
  resolver as getWorkspacesNames,
} from '../workspace/names';
import { deriveAlias } from '../../utils/deriveAlias';

export const getAliasesNames = moize.promise(async (
  from: string,
) => {
  const names = await getWorkspacesNames.async(from);
  const aliases = names.flatMap(
    (it) => deriveAlias(it),
  );
  return aliases;
}) satisfies PathResolverFunctionAsync<string[]>;

export const getAliasesNamesSync = moize((
  from: string,
) => {
  const names = getWorkspacesNames.sync(from);
  const aliases = names.flatMap(
    (it) => deriveAlias(it),
  );
  return aliases;
}) satisfies PathResolverFunction<string[]>;

export const resolver = {
  async: getAliasesNames,
  sync: getAliasesNamesSync,
} satisfies PathResolver<string[]>;
