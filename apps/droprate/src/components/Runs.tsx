import type { PrimitiveAtom } from 'jotai/vanilla';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Stats } from './Stats';
import { useAtomInput } from '../hooks/useAtomInput';
import { unitDroprate } from '../state/atoms';

export function Runs({ atom }: { atom: PrimitiveAtom<number> }) {
  const {
    value: runs, state, onChange,
  } = useAtomInput({ atom });
  const probability = useAtomValue(unitDroprate);
  const percentage = useMemo(
    () => Number.parseInt(`${(1 - (1 - probability) ** runs) * 100}`, 10),
    [
      probability,
      runs,
    ],
  );
  return (
    <Stats>
      <Stats.Top>
        <Stats.Text>every</Stats.Text>
        <Stats.Input
          variant="outlined"
          value={state}
          onChange={onChange}
        />
        <Stats.Text>runs</Stats.Text>
      </Stats.Top>
      <Stats.Result>
        {`${percentage}%`}
      </Stats.Result>
    </Stats>
  );
}
