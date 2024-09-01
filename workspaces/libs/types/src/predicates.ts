import type {
  IsNever,
  IsUnknown,
} from 'type-fest';

export type IsKnown<T> =
  IsNever<T> extends true
    ? false
    : IsUnknown<T> extends true
      ? false
      : true;

export type BoolToUnknownNever<T extends boolean> =
  T extends true
    ? unknown
    : never;
