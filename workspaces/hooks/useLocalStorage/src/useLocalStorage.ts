import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useDebugValue,
} from 'react';
import type {
  Dispatch,
  SetStateAction,
} from 'react';

export const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue: T,
) => {
  const getValueFromLocalStorage = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(getValueFromLocalStorage());

  useEffect(() => {
    const value = getValueFromLocalStorage();
    setStoredValue(value);
  }, [getValueFromLocalStorage]);

  const changeHandler = useCallback(
    (event: StorageEvent) => {
      const {
        key: changeKey, newValue,
      } = event;
      if (key === changeKey) {
        setStoredValue(JSON.parse(newValue || ''));
      }
    },
    [key],
  );

  useEffect(() => {
    window.addEventListener('storage', changeHandler);
    return () => {
      window.removeEventListener('storage', changeHandler);
    };
  }, [changeHandler]);

  useDebugValue(`${key}: ${storedValue}`);

  return useMemo(() => {
    const setValue = ((value: SetStateAction<T>) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      if (valueToStore !== storedValue) {
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      return true;
    }) satisfies Dispatch<SetStateAction<T>>;

    return [storedValue, setValue] as const;
  }, [storedValue, key]);
};

export default useLocalStorage;
