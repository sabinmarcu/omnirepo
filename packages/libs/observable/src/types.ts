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
export type ObservableSubscriberStore<T> = Set<Observer<T>>;

export type RawObservable<T> = {
  subscribe: (observer: Observer<T>) => Subscription;
};

export type Subject<T> =
  & Observable<T>
  & ObserverController<T>;

export type Observable<T> =
  & RawObservable<T>
  & {
    get value(): T;
    filter: ObservableFilterFunction<T>;
    map: ObservableMapFunction<T>;
  };

export type PipedObservable<T> =
  & Observable<T>
  & Subscription;

export type ObservableFilterFunction<T> = (
  filter: (input: T) => boolean
) => PipedObservable<T>;

export type ObservableMapFunction<T> = <R>(
  map: (input: T) => R
) => PipedObservable<R>;

export type TypeOfObservable<T extends Observable<any>> =
  T extends Observable<infer U>
    ? U
    : never;

export type TypeOfObservableOrType<T extends any> =
  T extends Observable<infer U>
    ? U
    : T;

export type ObservableProjection<
  Observables extends Observable<any>[],
> =
  Observables extends [Observable<infer Current>, ...infer Rest extends Observable<any>[]]
    ? [Current, ...ObservableProjection<Rest>]
    : [];
