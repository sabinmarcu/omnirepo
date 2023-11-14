import { z } from 'zod';
import type { RawDebugRule } from './types';

const fragmentValidCharacters = '@a-zA-Z9-9*';
const fragmentRegex = new RegExp([
  '^',
  '(?<disabled>-?)',
  `(?<namespaceOrPath>[${fragmentValidCharacters}]+)?`,
  `(?::(?<path>[${fragmentValidCharacters}]+))?`,
  '(?:#(?<channel>[a-zA-Z0-9]+))?',
  '$',
].join(''));

const fragmentRegexGroupSchema = z.object({
  disabled: z.string().default(''),
  namespaceOrPath: z.string().default(''),
  path: z.string().default(''),
  channel: z.string().default(''),
});

export const parseDebugStringFragmentPath = (
  groups: z.infer<typeof fragmentRegexGroupSchema>,
): Pick<RawDebugRule, 'path' | 'namespace'> => {
  const { path, namespaceOrPath } = groups;
  if (path) {
    return {
      path,
      namespace: namespaceOrPath,
    };
  }
  return {
    path: namespaceOrPath,
    namespace: '',
  };
};

class EmptyInputError extends Error {
  constructor() {
    super('Empty input!');
  }
}

export const parseDebugStringFragment = (
  input: string,
): RawDebugRule | undefined => {
  try {
    if (input === '') {
      throw new EmptyInputError();
    }
    const { groups } = fragmentRegex.exec(input) ?? {};
    const parsed = fragmentRegexGroupSchema.parse(groups);
    const { namespace, path } = parseDebugStringFragmentPath(parsed);
    const { channel, disabled } = parsed;
    return {
      channel: channel ?? '',
      enabled: !disabled,
      namespace,
      path,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // TODO: Find a better way to log this
      console.warn(error.issues);
      return undefined;
    }
    if (error instanceof EmptyInputError) {
      // TODO: Find a better way to log this
      console.warn(`Not a valid debug string (${input})!`);
      return undefined;
    }
    throw error;
  }
};

export const parseDebugString = (input: string) => {
  const fragments = input
    .split(',')
    .map((fragment) => fragment.trim());
  return fragments
    .map(
      (fragment) => parseDebugStringFragment(fragment),
    )
    .filter(Boolean);
};
