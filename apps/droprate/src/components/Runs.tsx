import type { PrimitiveAtom } from 'jotai/vanilla';
import { useAtomValue } from 'jotai';
import {
  useCallback,
  useMemo,
} from 'react';
import { Clear } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { focusAtom } from 'jotai-optics';
import { Stats } from './Stats.js';
import { useAtomInput } from '../hooks/useAtomInput.js';
import { unitDroprate } from '../state/atoms.js';
import type { StateType } from '../state/state.js';

interface RunsProperties {
  atom: PrimitiveAtom<StateType['runsList'][number]>,
  onRemove?: (input: string) => void,
}

export function Runs({
  atom,
  onRemove,
}: RunsProperties) {
  const runsAtom = useMemo(
    () => focusAtom(atom, (optic) => optic.prop('runs')),
    [atom],
  );
  const {
    value: runs, state, onChange,
  } = useAtomInput({ atom: runsAtom });
  const { id } = useAtomValue(atom);
  const probability = useAtomValue(unitDroprate);
  const percentage = useMemo(
    () => Number.parseInt(`${(1 - (1 - probability) ** runs) * 100}`, 10),
    [
      probability,
      runs,
    ],
  );
  const onClickRemove = useCallback(
    () => onRemove?.(id),
    [
      id,
      onRemove,
    ],
  );
  return (
    <Stats>
      {onRemove && (
        <Stats.Actions>
          <Tooltip title="Remove Stat">
            <Stats.ActionButton size="small" onClick={onClickRemove}>
              <Clear />
            </Stats.ActionButton>
          </Tooltip>
        </Stats.Actions>
      )}
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
