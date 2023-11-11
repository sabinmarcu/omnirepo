import { makeController } from './controller';
import type {
  Observer,
  ObservableDispatch,
  Observable,
  Subscription,
  ObservableValueStore,
  ObservableSubscriberStore,
} from './types';

export const observable = <T>(
  source: ObservableDispatch<T>,
) => {
  const store: ObservableValueStore<T> = { value: undefined } as ObservableValueStore<T>;
  const subscribers = new Set<Observer<T>>() satisfies ObservableSubscriberStore<T>;

  const subscribe = (observer: Observer<T>): Subscription => {
    subscribers.add(observer);
    observer.next?.(store.value);
    return {
      unsubscribe: () => {
        subscribers.delete(observer);
      },
    };
  };

  const sourceDispatcher = makeController<T>(store, subscribers);
  source(sourceDispatcher);

  return {
    get value() {
      return store.value;
    },
    subscribe,
  };
};

observable.from = <T>(value: T) => observable<T>(({ next }) => next?.(value));

/**
 * Check if a given value is an Observer
 * @param value - Value to be checked
 */
export const isObservable = (value: any): value is Observable<any> => !!(
  value
  && typeof value === 'object'
  && Object.keys(value).every((key) => ['value', 'subscribe'].includes(key))
  && typeof value.subscribe === 'function'
);
