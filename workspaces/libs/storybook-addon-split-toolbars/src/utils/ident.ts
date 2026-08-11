import type { Globals } from '@storybook/core/types';
import type { Ident as Identifier } from '../types.js';
import { DEFAULT_ITEMS_KEY } from '../constants.js';

const identifierSeparator = '--';

export const getGlobalIdent = (
  globals: Globals,
  identifier: Identifier,
) => {
  const { id, key } = identifier;
  const globalValue = globals[id] as string | undefined;
  if (!globalValue) {
    return undefined;
  }
  if (key === DEFAULT_ITEMS_KEY) {
    return globalValue;
  }
  const [valueKey, value] = globalValue.split(identifierSeparator);
  if (key === valueKey) {
    return value;
  }
  return undefined;
};

export const setGlobalIdent = (
  identifier: Identifier,
  value: string,
) => {
  if (identifier.key === DEFAULT_ITEMS_KEY) {
    return value;
  }
  return [identifier.key, value].join(identifierSeparator);
};

export const unpackIdent = (identifier: string) => {
  const [key, value] = identifier.split(identifierSeparator);
  return [key, value] as const;
};

export const ident = (id: string, key: string) => ({
  id,
  key,
} satisfies Identifier);
