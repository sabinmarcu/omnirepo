import {
  useAtom,
  useAtomValue,
} from 'jotai';
import {
  IconButton,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  useCallback,
  useMemo,
} from 'react';
import { focusAtom } from 'jotai-optics';
import { splitAtom } from 'jotai/utils';
import dayjs from 'dayjs';
import {
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import type {
  RotationTeamProperties,
  RotationProperties,
  RotationTeamListProperties,
} from './Rotation.types.js';
import {
  RotationDisplayEditButton,
  RotationDisplayList,
  RotationDisplayListCardContent,
  RotationDisplayListItem,
  RotationDisplayListsWrapper,
  RotationDisplayTeamName,
  RotationDisplayTeamNameWrapper,
  RotationMetadataCard,
} from './Rotation.display.style.js';
import {
  offsetListBy,
  selectMemberForOffset,
} from '../utils/arrays.js';
import { parseDate } from '../utils/date.ts';
import {
  DndSortDragHandleVertical,
} from './DndSort.tsx';

type WeekNumberProperties = {
  weekNumber: number;
};

export type RotationDisplayTeamListProperties =
& WeekNumberProperties
& RotationTeamListProperties;

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

  const atomsToRender = useMemo(
    () => [
      -2,
      -1,
      0,
      1,
      2,
    ].map((offset) => {
      const selected = selector(offset);
      return {
        member: list[selected],
        level: offset,
      } as const;
    }),
    [
      selector,
      list,
    ],
  );

  return (
    <RotationDisplayList>
      {atomsToRender.map(({
        member,
        level,
      }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <RotationDisplayListItem key={`${member.id}-${index}`} level={level}>
          <ListItemText>{member.name}</ListItemText>
        </RotationDisplayListItem>
      ))}
    </RotationDisplayList>
  );
}

type RotationDisplayTeamShiftButtonProperties = {
  offset: number
} & RotationTeamListProperties;

export function RotationDisplayTeamShiftButton({
  atom,
  offset,
}: RotationDisplayTeamShiftButtonProperties) {
  const [
    ,setList,
  ] = useAtom(atom);
  const onShift = useCallback(
    () => {
      setList((oldList) => offsetListBy(oldList, offset));
    },
    [
      setList,
      offset,
    ],
  );
  return (
    <IconButton onClick={onShift}>
      {offset > 0
        ? <KeyboardArrowDown />
        : <KeyboardArrowUp />}
    </IconButton>
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
      <RotationDisplayTeamNameWrapper>
        <RotationDisplayTeamShiftButton atom={listAtom} offset={-1} />
        <RotationDisplayTeamName variant="h6">
          {name}
        </RotationDisplayTeamName>
        <RotationDisplayTeamShiftButton atom={listAtom} offset={1} />
      </RotationDisplayTeamNameWrapper>
      <RotationDisplayTeamList atom={listAtom} weekNumber={weekNumber} />
    </RotationDisplayListCardContent>
  );
}

export function RotationDisplay({
  atom,
  onToggle,
  dndProps,
}: RotationProperties) {
  const {
    name,
    every,
    startDate,
  } = useAtomValue(atom);
  const weekNumber = useMemo(
    () => {
      const weekSinceStart = dayjs(Date.now()).diff(parseDate(startDate), 'week');
      const rotationsSinceStart = Math.floor(weekSinceStart / every);
      return rotationsSinceStart;
    },
    [
      startDate,
      every,
    ],
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
      <DndSortDragHandleVertical {...dndProps} />
      <RotationDisplayEditButton onClick={onToggle}>
        <Edit />
      </RotationDisplayEditButton>
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
