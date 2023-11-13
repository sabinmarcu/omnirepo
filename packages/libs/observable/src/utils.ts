import type {
  Observable,
  ObservableValueStore,
} from './types';

export const observableValueStore = <T>(
  input?: ObservableValueStore<T>,
) => (input ?? { value: undefined } as ObservableValueStore<T>);

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
