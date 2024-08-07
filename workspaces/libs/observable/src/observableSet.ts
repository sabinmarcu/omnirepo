import type { RawFunction } from '@sabinmarcu/types';
import { subject } from './subject.js';
import type {
  Observable,
  Subject,
} from './types.js';

export interface IObservableSet<T> extends Observable<Set<T>>, Set<T> {}
export type ObservableSet<T> = Omit<IObservableSet<T>, 'value'>;

export type MethodsOfSet = {
  [Key in keyof Set<any> & string]: Set<any>[Key] extends RawFunction
    ? Key
    : never
}[keyof Set<any> & string];

export const SetKeysToWrap: MethodsOfSet[] = [
  'add',
  'clear',
  'delete',
];

export const wrapSetMethod = <
  InputSet extends Set<any>,
  MethodName extends MethodsOfSet,
>(
    source: InputSet,
    method: MethodName,
    store: Subject<InputSet>,
  ) => {
  const member = source[method];
  const replacement = (
    (...parameters: Parameters<typeof member>) => {
      const result = Reflect.apply((member as any), source, parameters);
      store.next(source);
      return result;
    }) as typeof member;
  return replacement;
};

export const observableSet = <T>(
  source: Set<T> = new Set<T>(),
): ObservableSet<T> => {
  const store = subject(source);
  const newSet = new Set(source) as ObservableSet<T>;
  for (const key of SetKeysToWrap) {
    newSet[key] = wrapSetMethod(source, key, store) as any;
  }
  newSet.subscribe = store.subscribe;
  return newSet;
};
