import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { PlusOne } from '@mui/icons-material';
import {
  probabilityList,
  probabilityListAtom,
} from '../state/atoms';
import {
  StatsListSection,
  StatsListDescription,
  StatsListAddButton,
  StatsListActions,
} from './StatsList';

import { ProbabilityRuns } from './ProbabilityRuns';

export function ProbabilityRunsList() {
  const [
    ,setList,
  ] = useAtom(probabilityListAtom);
  const [probabilites] = useAtom(probabilityList);
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
          probability: Number.parseInt(`${Math.random() * 100}`, 10),
          id: nanoid(),
        },
      ]);
    },
    [setList],
  );
  return (
    <StatsListSection>
      <StatsListDescription>
        Expected number of runs
      </StatsListDescription>
      {probabilites.map((atom) => (
        <ProbabilityRuns
          atom={atom}
          key={atom.toString()}
          onRemove={probabilites.length > 1 ? onRemove : undefined}
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
