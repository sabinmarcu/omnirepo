import type { RawFunction } from '@sabinmarcu/types';
import { subject } from './subject.js';
import type {
  Observable,
  Subject,
} from './types.js';

export interface IObservableMap<K, V> extends Observable<Map<K, V>>, Map<K, V> {}
export type ObservableMap<K, V> = Omit<IObservableMap<K, V>, 'value'>;

export type MethodsOfMap = {
  [Key in keyof Map<any, any> & string]: Map<any, any>[Key] extends RawFunction
    ? Key
    : never
}[keyof Map<any, any> & string];

export const MapKeysToWrap: MethodsOfMap[] = [
  'clear',
  'delete',
  'set',
];

export const wrapMapMethod = <
  InputMap extends Map<any, any>,
  MethodName extends MethodsOfMap,
>(
    source: InputMap,
    method: MethodName,
    store: Subject<InputMap>,
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

export const observableMap = <K, V>(
  source: Map<K, V> = new Map<K, V>(),
): ObservableMap<K, V> => {
  const store = subject(source);
  const newMap = new Map(source) as ObservableMap<K, V>;
  for (const key of MapKeysToWrap) {
    newMap[key] = wrapMapMethod(source, key, store) as any;
  }
  newMap.subscribe = store.subscribe;
  return newMap;
};
