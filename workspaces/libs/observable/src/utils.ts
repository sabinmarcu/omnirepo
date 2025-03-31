/* eslint-disable unicorn/prevent-abbreviations */
import type {
  MutableStore,
} from '@sabinmarcu/utils-primitives';
import type {
  Observable,
} from './types.js';

export const observableValueStore = <T>(
  input?: MutableStore<T>,
) => (input ?? { value: undefined } as MutableStore<T>);

export const extendObservable = <
  T extends Observable<any>,
  Extra extends Record<PropertyKey, any>,
>(
    input: T,
    extra: Extra,
  ) => ({
    ...input,
    get value() {
      return input.value;
    },
    ...extra,
  } as T & Extra);
