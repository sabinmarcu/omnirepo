import type { IsUnknown } from 'type-fest';

export type IsKnown<T> =
  [T] extends [never]
    ? false
    : IsUnknown<T> extends true
      ? false
      : true;

export type BoolToUnknownNever<T extends boolean> =
  T extends true
    ? unknown
    : never;
