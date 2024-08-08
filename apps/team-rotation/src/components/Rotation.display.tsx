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
import dayjs from 'dayjs';
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

type WeekNumberProperties = {
  weekNumber: number;
};

export type RotationDisplayTeamListProperties =
& WeekNumberProperties
& RotationTeamListProperties;

const selectMemberForOffset = (
  weekNumber: number,
  total: number,
  offset: number,
) => {
  const today = weekNumber % total;
  if (offset === 0) {
    return today;
  }
  const diff = today + offset;
  if (diff < 0) {
    return (total - Math.abs(diff)) % total;
  }
  return diff % total;
};

export function RotationDisplayTeamList({
  atom,
  weekNumber,
}: RotationDisplayTeamListProperties) {
  const list = useAtomValue(atom);
  const selector = useMemo(
    () => selectMemberForOffset.bind(undefined, weekNumber, list.length),
    [
      weekNumber,
      list.length,
    ],
  );

  const atomsToRender = [
    -2,
    -1,
    0,
    1,
    2,
  ].map((offset) => {
    const selected = selector(offset);
    return {
      member: list[selected],
      level: 0 - Math.abs(offset),
    } as const;
  });

  return (
    <RotationDisplayList>
      {atomsToRender.map(({ member }) => (
        <RotationDisplayListItem key={member}>
          <ListItemText>{member}</ListItemText>
        </RotationDisplayListItem>
      ))}
    </RotationDisplayList>
  );
}

type RotationDisplayTeamProperties =
& WeekNumberProperties
& RotationTeamProperties;

export function RotationDisplayTeam({
  atom,
  weekNumber,
}: RotationDisplayTeamProperties) {
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
      <RotationDisplayTeamList atom={listAtom} weekNumber={weekNumber} />
    </RotationDisplayListCardContent>
  );
}

export function RotationDisplay({ atom }: RotationProperties) {
  const {
    name,
    every,
    startDate,
  } = useAtomValue(atom);
  const weekNumber = useMemo(
    () => dayjs(Date.now()).diff(startDate, 'week'),
    [startDate],
  );
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
          <RotationDisplayTeam
            atom={teamAtom}
            key={`${teamAtom}`}
            weekNumber={weekNumber}
          />
        ))}
      </RotationDisplayListsWrapper>
    </>
  );
}