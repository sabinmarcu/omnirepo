import { type RawFunction } from '@sabinmarcu/types';

export function debounce<T extends RawFunction>(function_: T, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...arguments_: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => { Reflect.apply(function_, undefined, arguments_); }, timeout);
  };
}
