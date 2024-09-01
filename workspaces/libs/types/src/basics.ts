import type { IsNever } from 'type-fest';

export type RawFunction = (...arguments_: any[]) => any;
export type NeverToUnknown<T> = IsNever<T> extends true
  ? unknown
  : T;
