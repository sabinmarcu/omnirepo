import {
  useAtomValue,
} from 'jotai';
import {
  ListItemText,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { focusAtom } from 'jotai-optics';
import { splitAtom } from 'jotai/utils';
import type {
  RotationTeamProperties,
  RotationProperties,
  RotationTeamListProperties,
} from './Rotation.types.tsx';
import {
  RotationDisplayList,
  RotationDisplayListCardContent,
  RotationDisplayListItem,
  RotationDisplayListsWrapper,
  RotationDisplayTeamName,
  RotationMetadataCard,
} from './Rotation.display.style.tsx';

export function RotationDisplayTeamList({ atom }: RotationTeamListProperties) {
  const list = useAtomValue(atom);
  return (
    <RotationDisplayList>
      {list.map((member) => (
        <RotationDisplayListItem key={member}>
          <ListItemText>{member}</ListItemText>
        </RotationDisplayListItem>
      ))}
    </RotationDisplayList>
  );
}

export function RotationDisplayTeam({ atom }: RotationTeamProperties) {
  const { name } = useAtomValue(atom);
  const listAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('list'),
    ),
    [atom],
  );
  return (
    <RotationDisplayListCardContent>
      <RotationDisplayTeamName variant="h6">{name}</RotationDisplayTeamName>
      <RotationDisplayTeamList atom={listAtom} />
    </RotationDisplayListCardContent>
  );
}

export function RotationDisplay({ atom }: RotationProperties) {
  const {
    name,
    every,
    startDate,
  } = useAtomValue(atom);
  const teamsAtom = useMemo(
    () => {
      const focused = focusAtom(
        atom,
        (optics) => optics.prop('teams'),
      );
      return splitAtom(focused);
    },
    [atom],
  );
  const teams = useAtomValue(teamsAtom);
  return (
    <>
      <RotationMetadataCard>
        <Typography color="text.secondary" gutterBottom>
          {`every ${every} weeks`}
        </Typography>
        <Typography variant="h5" gutterBottom>{name}</Typography>
        <Typography color="text.secondary">
          { 'starting on ' }
          <Typography color="text" component="span">{startDate}</Typography>
        </Typography>
      </RotationMetadataCard>
      <RotationDisplayListsWrapper>
        {teams.map((teamAtom) => (
          <RotationDisplayTeam atom={teamAtom} key={`${teamAtom}`} />
        ))}
      </RotationDisplayListsWrapper>
    </>
  );
}