import type { Globals } from '@storybook/core/types';
import type { Ident } from '../types.js';
import { DEFAULT_ITEMS_KEY } from '../constants.js';

const identSeparator = ':';

export const getGlobalIdent = (
  globals: Globals,
  ident: Ident,
) => {
  const { id, key } = ident;
  const globalValue = globals[id] as string | undefined;
  if (!globalValue) {
    return undefined;
  }
  if (key === DEFAULT_ITEMS_KEY) {
    return globalValue;
  }
  const [valueKey, value] = globalValue.split(identSeparator);
  if (key === valueKey) {
    return value;
  }
  return undefined;
};

export const setGlobalIdent = (
  ident: Ident,
  value: string,
) => {
  if (ident.key === DEFAULT_ITEMS_KEY) {
    return value;
  }
  return [ident.key, value].join(identSeparator);
};

export const ident = (id: string, key: string) => ({
  id,
  key,
} satisfies Ident);
