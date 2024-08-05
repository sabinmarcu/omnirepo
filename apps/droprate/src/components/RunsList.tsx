import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { PlusOne } from '@mui/icons-material';
import {
  runsList,
  runsListAtom,
} from '../state/atoms';
import {
  StatsListSection,
  StatsListDescription,
  StatsListAddButton,
  StatsListActions,
} from './StatsList';

import { Runs } from './Runs';

export function RunsList() {
  const [
    ,setList,
  ] = useAtom(runsListAtom);
  const [runs] = useAtom(runsList);
  const onRemove = useCallback(
    (id: string) => {
      setList((oldList) => {
        const newList = oldList.filter((runsSet) => runsSet.id !== id);
        if (newList.length !== oldList.length) {
          return newList;
        }
        return oldList;
      });
    },
    [setList],
  );
  const onAdd = useCallback(
    () => {
      setList((oldList) => [
        ...oldList,
        {
          runs: Number.parseInt(`${Math.random() * 100}`, 10),
          id: nanoid(),
        },
      ]);
    },
    [setList],
  );
  return (
    <StatsListSection>
      <StatsListDescription>
        Your chance of winning at least once
      </StatsListDescription>
      {runs.map((atom) => (
        <Runs
          atom={atom}
          key={atom.toString()}
          onRemove={runs.length > 1 ? onRemove : undefined}
        />
      ))}
      <StatsListActions>
        <StatsListAddButton variant="contained" color="inherit" onClick={onAdd}>
          <PlusOne />
        </StatsListAddButton>
      </StatsListActions>
    </StatsListSection>
  );
}
