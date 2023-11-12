export type Subscription = {
  unsubscribe: () => void;
};

export type Observer<T> = {
  next?: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
};

export type ObserverController<T> = Required<Observer<T>>;
export type ObservableDispatch<T> = (controller: ObserverController<T>) => void;
export type ObservableValueStore<T> = { value: T };
export type ObservableSubscriberStore<T> = Set<Observer<T>>;

export type RawObservable<T> = {
  subscribe: (observer: Observer<T>) => Subscription;
};

export type Subject<T> =
  & Observable<T>
  & ObserverController<T>;

export type ObservableFilter<T> = (
  filter: (input: T) => boolean
) => Observable<T>;

export type ObservableMap<T> = <R>(
  map: (input: T) => R
) => Observable<R>;

export type Observable<T> =
  & RawObservable<T>
  & {
    get value(): T;
    filter: ObservableFilter<T>;
    map: ObservableMap<T>;
  };

export type ObservableProjection<
  Observables extends Observable<any>[],
> =
  Observables extends [Observable<infer Current>, ...infer Rest extends Observable<any>[]]
    ? [Current, ...ObservableProjection<Rest>]
    : [];
