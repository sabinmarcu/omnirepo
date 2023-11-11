import type {
  ObservableSubscriberStore,
  ObservableValueStore,
  ObserverController,
} from './types';

export const makeControllerFunction = <T>(
  valueStore: ObservableValueStore<T>,
  subscriberStore: ObservableSubscriberStore<T>,
) => <Key extends keyof ObserverController<T> = 'next'>(
  key: Key,
) => (...arguments_: Parameters<ObserverController<T>[Key]>) => {
  if (key === 'next') {
    // eslint-disable-next-line no-param-reassign
    valueStore.value = arguments_[0] as T;
  }
  for (const subscriber of subscriberStore) {
    const dispatcher = subscriber[key];
    if (dispatcher) {
      (dispatcher as any)(...arguments_);
    }
  }
};

export const makeController = <T>(
  valueStore: ObservableValueStore<T>,
  subscriberStore: ObservableSubscriberStore<T>,
) => {
  const factory = makeControllerFunction<T>(valueStore, subscriberStore);
  return {
    next: factory('next'),
    error: factory('error'),
    complete: factory('complete'),
  } satisfies ObserverController<T>;
};
