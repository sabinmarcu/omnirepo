import type {
  ProxyExtras,
  ProxyStringOf,
} from './createProxyString.types.js';

export const createProxyString = <
  T extends string,
  Extras extends ProxyExtras,
>(
    extras: Extras,
    input: T,
  ): ProxyStringOf<T, Extras> => {
  // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
  const newString = new String(input) as unknown as ProxyStringOf<T, Extras>;

  // Utils
  Reflect.defineProperty(
    newString,
    'equals',
    {
      value: (value: string) => value === input,
      writable: false,
      enumerable: false,
    },
  );

  Reflect.defineProperty(
    newString,
    'raw',
    {
      value: input,
      writable: false,
    },
  );

  // Cases
  for (const [key, value] of Object.entries(extras)) {
    Reflect.defineProperty(
      newString,
      key,
      {
        get: value,
      },
    );
  }

  // Done
  return newString;
};
