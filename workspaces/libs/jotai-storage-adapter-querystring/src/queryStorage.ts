import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import type { Encoder } from './types.js';

const queryStorageGetter = <T = unknown>(encoder: Encoder<T>) => (
  (key: string, initialValue: T) => {
    const url = new URL(window.location.toString());
    const data = url.searchParams.get(key);

    if (!data) {
      return initialValue;
    }

    if (!encoder) {
      return data as unknown as T;
    }

    try {
      return encoder.decode(data);
    } catch {
      return initialValue;
    }
  }
);

const queryStorageSetter = <T = unknown>(encoder: Encoder<T>) => (
  (key: string, value: T) => {
    const url = new URL(window.location.toString());
    const data = encoder ? encoder.encode(value) : value;
    url.searchParams.set(key, data as unknown as string);
    window.history.pushState({}, '', url);
  }
);

const queryStorageRemover = (key: string) => {
  const url = new URL(window.location.toString());
  url.searchParams.delete(key);
  window.history.pushState({}, '', url);
};

const queryStorageSubscriber = <T = unknown>(getter: ReturnType<typeof queryStorageGetter<T>>) => (
  (key: string, callback: (input: T) => void) => {
    const handler = () => {
      callback(getter(key, undefined as unknown as T));
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }
);

export const queryStorage = <T = unknown>(encoder: Encoder<T>) => {
  const getItem = queryStorageGetter(encoder);
  const setItem = queryStorageSetter(encoder);
  const removeItem = queryStorageRemover;
  const subscribe = queryStorageSubscriber(getItem);
  return {
    getItem,
    setItem,
    removeItem,
    subscribe,
  } satisfies SyncStorage<T>;
};
