import type {
  Observable,
  Observer,
  ObservableDispatch,
  Subscription,
  ObservableValueStore,
  ObservableSubscriberStore,
  RawObservable,
  ObserverController,
  ObservableProjection,
} from './types';

export const testObservableKeys = ['subscribe', 'filter', 'map', 'value'];

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

export const observableValueStore = <T>(
  input?: ObservableValueStore<T>,
) => (input ?? { value: undefined } as ObservableValueStore<T>);

export const observable = <const T>(
  source: ObservableDispatch<T>,
): Observable<T> => {
  const valueStore: ObservableValueStore<T> = observableValueStore<T>();
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

  const map = <R>(
    mapFunction: (input: T) => R,
  ) => {
    const newObservable = observable<R>(
      ({ next, complete, error }) => (
        observableInstance.subscribe({
          next: (value) => next(mapFunction(value)),
          complete,
          error,
        })
      ),
    ) satisfies Observable<R>;
    return newObservable;
  };

  return {
    ...observableInstance,
    get value() {
      return valueStore.value;
    },
    filter,
    map,
  } satisfies Observable<T>;
};
/**
 * Create a static observable (only has one initial value, does not change) from a given value
 * @template T - Type of input observable
 * @param value - The value to be converted into a static observable
 */
export const observableFrom = <const T>(value: T) => observable<T>(({ next }) => next?.(value));
observable.from = observableFrom;

/**
* Projedct a set of observables into a single observable based on a projection function
 * @template Observables extends Observable<any>[] - Observables to be projected
 * @template Result - Result of the projection
 * @param input - Observables to be projected
 * @param projection - The projection function
 * @returns The result of the projection function applied to input
 */
export const projectObservables = <
  Observables extends Observable<any>[],
  Result,
>(
  projection: (...values: ObservableProjection<Observables>) => Result,
  ...input: Observables
) => {
  const getProjectionValues = () => (
    input.map(({ value }) => value) as ObservableProjection<Observables>
  );

  const projectionObservable = observable(({ next, error }) => {
    const projectionValueStore = observableValueStore({
      get value() {
        const projectionValues = getProjectionValues();
        const result = projection(...projectionValues);
        return result;
      },
    });

    const nextFunction = () => next(projectionValueStore.value);
    for (const item of input) {
      item.subscribe({ next: nextFunction, error });
    }
  }) satisfies Observable<Result>;

  return projectionObservable;
};
observable.project = projectObservables;

/**
 * Check if a given value is an Observer
 * @param value - Value to be checked
 */
export const isObservable = <T = any>(value: any): value is Observable<T> => !!(
  value
  && typeof value === 'object'
  && Object.keys(value).every((key) => testObservableKeys.includes(key))
  && typeof value.subscribe === 'function'
);
