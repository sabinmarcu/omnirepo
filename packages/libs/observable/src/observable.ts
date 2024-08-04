import type { MutableStore } from '@sabinmarcu/utils-primitives';
import { observableKeys } from './constants';
import { addToSubscriptionPool } from './mock';
import type {
  Observable,
  Observer,
  ObservableDispatch,
  Subscription,
  ObservableSubscriberStore,
  RawObservable,
  ObserverController,
  PipedObservable,
  ObservableProjector,
} from './types';
import {
  extendObservable,
  observableValueStore,
} from './utils';

export const makeControllerFunction = <T>(
  valueStore: MutableStore<T>,
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
  valueStore: MutableStore<T>,
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
  initialValue?: T,
): Observable<T> => {
  const valueStore: MutableStore<T> = observableValueStore<T>(
    initialValue
      ? { value: initialValue }
      : undefined,
  );
  const subscribersStore = new Set<Observer<T>>() satisfies ObservableSubscriberStore<T>;

  const subscribe = (observer: Observer<T>): Subscription => {
    subscribersStore.add(observer);
    observer.next?.(valueStore.value);
    const subscription = {
      unsubscribe: () => {
        subscribersStore.delete(observer);
      },
    } satisfies Subscription;
    return addToSubscriptionPool(subscription);
  };

  const sourceDispatcher = makeController<T>(valueStore, subscribersStore);
  source(sourceDispatcher);

  const observableInstance = {
    subscribe,
  } satisfies RawObservable<T>;

  const filter = (
    filterFunction: (input: T | undefined) => boolean,
  ) => {
    let subscription: Subscription;
    const newObservable = observable<T>(
      ({
        next, complete, error,
      }) => {
        subscription = observableInstance.subscribe({
          next: (value) => {
            if (filterFunction(value)) {
              next(value);
            }
          },
          complete,
          error,
        });
      },
    ) satisfies Observable<T>;
    return extendObservable(
      newObservable,
      {
        unsubscribe: () => subscription.unsubscribe(),
      },
    ) satisfies PipedObservable<T>;
  };

  const map = <R>(
    mapFunction: (input: T | undefined) => R,
  ) => {
    let subscription: Subscription;
    const newObservable = observable<R>(
      ({
        next, complete, error,
      }) => {
        subscription = observableInstance.subscribe({
          next: (value) => next(mapFunction(value)),
          complete,
          error,
        });
      },
    ) satisfies Observable<R>;
    return extendObservable(
      newObservable,
      {
        unsubscribe: () => subscription.unsubscribe(),
      },
    ) satisfies PipedObservable<R>;
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
* Project a set of observables into a single observable based on a projection function
 * @template Observables extends Observable<any>[] - Observables to be projected
 * @template Result - Result of the projection
 * @param input - Observables to be projected
 * @param projection - The projection function
 * @returns The result of the projection function applied to input
 */
export const projectObservables: ObservableProjector = (...parameters: any[]) => {
  const projection = parameters.pop();
  const input = parameters;

  const getProjectionValues = () => (
    input.map(({ value }) => value) as any
  );

  const subscriptions: Subscription[] = [];
  const projectionObservable = observable(({
    next, error,
  }) => {
    const projectionValueStore = observableValueStore({
      get value() {
        const projectionValues = getProjectionValues();
        const result = projection(...projectionValues);
        return result;
      },
    });

    const nextFunction = () => next(projectionValueStore.value);
    for (const item of input) {
      subscriptions.push(item.subscribe({
        next: nextFunction,
        error,
      }));
    }
  });

  const subscription = {
    unsubscribe: () => {
      for (const item of subscriptions) {
        item.unsubscribe();
      }
    },
  } satisfies Subscription;

  return extendObservable(
    projectionObservable,
    subscription,
  ) as any;
};
observable.project = projectObservables;

/**
 * Check if a given value is an Observer
 * @param value - Value to be checked
 */
export const isObservable = <T = any>(value: any): value is Observable<T> => !!(
  value
  && typeof value === 'object'
  && observableKeys.every((key) => key in value)
  && typeof value.subscribe === 'function'
);
