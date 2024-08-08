import {
  Button,
  CardActions,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import {
  useAtom,
  useAtomValue,
} from 'jotai';
import type {
  ChangeEvent,
  ComponentProps,
} from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { focusAtom } from 'jotai-optics';
import type { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { splitAtom } from 'jotai/utils';
import type { PrimitiveAtom } from 'jotai/vanilla';
import {
  Delete,
  PlusOne,
} from '@mui/icons-material';
import type {
  RotationProperties,
  RotationTeamProperties,
} from './Rotation.types.js';
import {
  dateToState,
  parseDate,
} from '../utils/date.ts';
import {
  RotationEditCardContent,
  RotationEditCardEditWrapper,
  RotationEditCardWrapper,
  RotationEditTeamAddButton,
  RotationEditTeamCardContent,
  RotationEditTeamCardEditing,
  RotationEditTeamMemberAdd,
  RotationEditTeamMemberList,
  RotationEditTeamMemberListItem,
} from './Rotation.edit.style.js';
import {
  generateTeamList,
  generateTeamMember,
} from '../state/seed.js';
import type { RotationTeamMemberType } from '../state/types.ts';
import {
  DndSort,
  DndSortDragHandle,
} from './DndSort.tsx';
import { useDndSortable } from '../hooks/useDndSortable.ts';

export type RotationRootEditProperties = Omit<RotationProperties, 'onToggle' | 'dndProps'>;
export type RotationEditTextFieldProperties = {
  atom: PrimitiveAtom<string>
} & ComponentProps<typeof TextField>;

export const RotationEditTextField = forwardRef<HTMLInputElement, RotationEditTextFieldProperties>(
  ({
    atom,
    ...rest
  }, reference) => {
    const [
      input,
      setInput,
    ] = useAtom(atom);
    const onChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
      setInput(value);
    };
    return (
      <TextField
        {...rest}
        ref={reference}
        value={input}
        onChange={onChange}
      />
    );
  },
);

export function RotationEditStartDateField({ atom }: RotationRootEditProperties) {
  const startDateAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('startDate'),
    ),
    [atom],
  );
  const [
    startDate,
    setStartDate,
  ] = useAtom(startDateAtom);
  const [
    input,
    setInput,
  ] = useState(parseDate(startDate));
  const onChange = (value: Dayjs | null) => {
    if (!value) {
      return;
    }
    setInput(value);
  };
  useEffect(
    () => setStartDate(dateToState(input)),
    [
      setStartDate,
      input,
    ],
  );
  return (
    <DatePicker
      label="Rotation Start Date"
      value={input}
      onChange={onChange}
    />
  );
}

export function RotationEditEveryField({ atom }: RotationRootEditProperties) {
  const everyAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('every'),
    ),
    [atom],
  );
  const [
    every,
    setEvery,
  ] = useAtom(everyAtom);
  const [
    input,
    setInput,
  ] = useState(`${every}`);
  const onChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
    setInput(value);
  };
  useEffect(
    () => setEvery(Number.parseInt(input, 10)),
    [
      input,
      setEvery,
    ],
  );
  return (
    <TextField
      label="Happens Every X Weeks"
      value={input}
      onChange={onChange}
    />
  );
}

export function RotationEditNameField({ atom }: RotationRootEditProperties) {
  const nameAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('name'),
    ),
    [atom],
  );
  return (
    <RotationEditTextField atom={nameAtom} label="Rotation Name" />
  );
}

export type RotationEditTeamMemberProperties = {
  atom: PrimitiveAtom<RotationTeamMemberType>,
  index: number
};
export function RotationEditTeamMember({
  atom,
  index,
}: RotationEditTeamMemberProperties) {
  const nameAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('name'),
    ),
    [atom],
  );
  return (
    <RotationEditTextField
      label={`Member #${index + 1}`}
      atom={nameAtom}
      fullWidth
    />
  );
}

export type RotationEditTeamListProperties = {
  atom: PrimitiveAtom<RotationTeamMemberType[]>
};
export function RotationEditTeamList({ atom }: RotationEditTeamListProperties) {
  const [
    membersList,
    setMembersList,
  ] = useAtom(atom);
  const membersListAtom = useMemo(
    () => splitAtom(atom),
    [atom],
  );
  const addMember = useCallback(
    () => setMembersList((oldList) => [
      ...oldList,
      generateTeamMember(),
    ]),
    [setMembersList],
  );
  const removeMember = useCallback(
    (id: string) => () => setMembersList((oldList) => oldList.filter(
      (member) => member.id !== id,
    )),
    [setMembersList],
  );
  const members = useAtomValue(membersListAtom);
  return (
    <RotationEditTeamMemberList>
      {membersList.map((member, index) => (
        <RotationEditTeamMemberListItem
          key={member.id}
          secondaryAction={(
            <IconButton
              edge="end"
              aria-label="delete"
              color="error"
              onClick={removeMember(member.id)}
            >
              <Delete />
            </IconButton>
          )}
        >
          <RotationEditTeamMember
            index={index}
            atom={members[index]}
          />
        </RotationEditTeamMemberListItem>
      ))}
      <RotationEditTeamMemberListItem>
        <RotationEditTeamMemberAdd onClick={addMember}>
          <PlusOne />
        </RotationEditTeamMemberAdd>
      </RotationEditTeamMemberListItem>
    </RotationEditTeamMemberList>
  );
}

export type RotationEditTeamEditProperties = {
  index: number,
  onRemove: () => void
} & RotationTeamProperties;
export function RotationEditTeamEdit({
  atom,
  index,
  onRemove,
}: RotationEditTeamEditProperties) {
  const nameAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('name'),
    ),
    [atom],
  );
  const listAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('list'),
    ),
    [atom],
  );
  const {
    rootProps,
    dragHandleProps,
  } = useDndSortable(atom);
  return (
    <RotationEditTeamCardContent {...rootProps}>
      <DndSortDragHandle {...dragHandleProps} />
      <RotationEditTeamCardEditing>
        <RotationEditTextField atom={nameAtom} label={`Team #${index + 1} Name`} />
        <RotationEditTeamList atom={listAtom} />
      </RotationEditTeamCardEditing>
      <Button color="error" onClick={onRemove}>Remove Team</Button>
    </RotationEditTeamCardContent>
  );
}

export function RotationEditAllTeams({ atom }: RotationRootEditProperties) {
  const teamsListAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('teams'),
    ),
    [atom],
  );
  const [
    teamsList,
    setTeamsList,
  ] = useAtom(teamsListAtom);
  const teamsAtom = useMemo(
    () => splitAtom(teamsListAtom),
    [teamsListAtom],
  );
  const teams = useAtomValue(teamsAtom);
  const addTeam = useCallback(
    () => setTeamsList((oldTeams) => [
      ...oldTeams,
      generateTeamList(),
    ]),
    [setTeamsList],
  );
  const removeTeam = useCallback(
    (team: string) => () => {
      setTeamsList((oldTeams) => oldTeams.filter((maybeTeam) => maybeTeam.id !== team));
    },
    [setTeamsList],
  );
  return (
    <DndSort atom={teamsListAtom}>
      {teamsList.map((team, index) => (
        <RotationEditTeamEdit
          atom={teams[index]}
          onRemove={removeTeam(team.id)}
          index={index}
          key={team.id}
        />
      ))}
      <RotationEditTeamAddButton onClick={addTeam}>
        <PlusOne />
      </RotationEditTeamAddButton>
    </DndSort>
  );
}

export type RotationEditProperties = {
  onRemove: () => void,
} & RotationProperties;

export function RotationEdit({
  atom,
  onToggle,
  onRemove,
  dndProps,
}: RotationEditProperties) {
  return (
    <RotationEditCardWrapper>
      <RotationEditCardEditWrapper>
        <RotationEditCardContent>
          <DndSortDragHandle {...dndProps} />
          <RotationEditNameField atom={atom} />
          <RotationEditEveryField atom={atom} />
          <RotationEditStartDateField atom={atom} />
        </RotationEditCardContent>
        <RotationEditAllTeams atom={atom} />
      </RotationEditCardEditWrapper>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="error" onClick={onRemove}>Delete this Rotation</Button>
        <Button color="primary" onClick={onToggle}>Done</Button>
      </CardActions>
    </RotationEditCardWrapper>
  );
}