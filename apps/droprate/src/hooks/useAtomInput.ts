import { useAtom } from 'jotai';
import type { WritableAtom } from 'jotai/vanilla';
import type { ChangeEvent } from 'react';
import {
  useEffect,
  useState,
} from 'react';

export const useAtomInput = ({ atom }: { atom: WritableAtom<number, [number], void> }) => {
  const [value, setValue] = useAtom(atom);
  const [state, setState] = useState(`${value}`);

  const onChange = ({ currentTarget: { value: newValue } }: ChangeEvent<HTMLInputElement>) => {
    setState(newValue);
  };

  useEffect(() => {
    const nextValue = Number.parseFloat(state);
    if (nextValue && !Number.isNaN(nextValue)) {
      setValue(nextValue);
    }
  }, [state, setValue]);
  useEffect(() => setState(`${value}`), [value]);

  return { state, value, onChange } as const;
};
