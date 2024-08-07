import {
  useCallback,
  type PropsWithChildren,
} from 'react';
import { useAtom } from 'jotai';
import type { WritableAtom } from 'jotai/vanilla';
import {
  CounterButton,
  CounterInput,
  CounterSurface,
  CounterText,
  CounterWrapper,
} from './Counter.style.js';
import { useAtomInput } from '../hooks/useAtomInput.js';

interface MutateButtonProperties extends PropsWithChildren {
  atom: WritableAtom<number, [number], void>,
  offset: number,
}

export function MutateButton({
  atom,
  offset,
  children,
}: MutateButtonProperties) {
  const [
    value,
    setValue,
  ] = useAtom(atom);
  const onClick = useCallback(() => {
    setValue(value + offset);
  }, [
    value,
    offset,
    setValue,
  ]);
  return (
    <CounterButton type="button" onClick={onClick}>{children}</CounterButton>
  );
}

interface CounterProperties {
  atom: WritableAtom<number, [number], void>,
  beforeText?: string,
  afterText?: string,
}

export function Counter({
  atom,
  beforeText,
  afterText,
}: CounterProperties) {
  const {
    state, onChange,
  } = useAtomInput({ atom });

  return (
    <CounterWrapper>
      <MutateButton offset={-1} atom={atom}>-</MutateButton>
      <CounterSurface>
        <CounterText>{beforeText}</CounterText>
        <CounterInput value={state} onChange={onChange} />
        <CounterText>{afterText}</CounterText>
      </CounterSurface>
      <MutateButton offset={1} atom={atom}>+</MutateButton>
    </CounterWrapper>
  );
}
