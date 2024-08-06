import type { PrimitiveAtom } from 'jotai/vanilla';
import { useAtomValue } from 'jotai';
import {
  useCallback,
  useMemo,
} from 'react';
import { Clear } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { focusAtom } from 'jotai-optics';
import { Stats } from './Stats';
import { useAtomInput } from '../hooks/useAtomInput';
import { unitDroprate } from '../state/atoms';
import type { StateType } from '../state/state';

interface ProbabilityRunsProperties {
  atom: PrimitiveAtom<StateType['probabilityList'][number]>,
  onRemove?: (input: string) => void,
}

export function ProbabilityRuns({
  atom,
  onRemove,
}: ProbabilityRunsProperties) {
  const runsAtom = useMemo(
    () => focusAtom(atom, (optic) => optic.prop('probability')),
    [atom],
  );
  const {
    value: probability, state, onChange,
  } = useAtomInput({ atom: runsAtom });
  const { id } = useAtomValue(atom);
  const globalProbability = useAtomValue(unitDroprate);
  const runs = useMemo(
    () => {
      const runsNumber = Math.log(1 - probability / 100) / Math.log(1 - globalProbability);
      return Number.parseInt(`${Math.ceil(runsNumber)}`, 10);
    },
    [
      probability,
      globalProbability,
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
        <Stats.Text>for a</Stats.Text>
        <Stats.Input
          variant="outlined"
          value={state}
          onChange={onChange}
        />
        <Stats.Text>% chance</Stats.Text>
      </Stats.Top>
      <Stats.Result>
        {`${runs} runs`}
      </Stats.Result>
    </Stats>
  );
}