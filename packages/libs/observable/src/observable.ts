import type {
  Observable,
  Observer,
  ObservableDispatch,
  Subscription,
  ObservableValueStore,
  ObservableSubscriberStore,
  RawObservable,
  ObserverController,
} from './types';

export const testObservableKeys = ['subscribe', 'filter', 'value'];

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
  if (key === 'complete') {
    for (const subscriber of subscriberStore) {
      subscriberStore.delete(subscriber);
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

export const observable = <T>(
  source: ObservableDispatch<T>,
): Observable<T> => {
  const valueStore: ObservableValueStore<T> = { value: undefined } as ObservableValueStore<T>;
  const subscribersStore = new Set<Observer<T>>() satisfies ObservableSubscriberStore<T>;

  const subscribe = (observer: Observer<T>): Subscription => {
    subscribersStore.add(observer);
    observer.next?.(valueStore.value);
    return {
      unsubscribe: () => {
        subscribersStore.delete(observer);
      },
    };
  };

  const sourceDispatcher = makeController<T>(valueStore, subscribersStore);
  source(sourceDispatcher);

  const observableInstance = {
    subscribe,
  } satisfies RawObservable<T>;

  const filter = (
    filterFunction: (input: T) => boolean,
  ) => {
    const newObservable = observable<T>(
      ({ next, complete, error }) => (
        observableInstance.subscribe({
          next: (value) => {
            if (filterFunction(value)) {
              next(value);
            }
          },
          complete,
          error,
        })
      ),
    ) satisfies Observable<T>;
    return newObservable;
  };

  return {
    ...observableInstance,
    get value() {
      return valueStore.value;
    },
    filter,
  } satisfies Observable<T>;
};

observable.from = <T>(value: T) => observable<T>(({ next }) => next?.(value));

/**
 * Check if a given value is an Observer
 * @param value - Value to be checked
 */
export const isObservable = (value: any): value is Observable<any> => !!(
  value
  && typeof value === 'object'
  && Object.keys(value).every((key) => testObservableKeys.includes(key))
  && typeof value.subscribe === 'function'
);
