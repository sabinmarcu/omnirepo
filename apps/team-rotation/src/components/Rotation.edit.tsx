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
  useSetAtom,
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
import { nanoid } from 'nanoid';
import type {
  RotationProperties,
  RotationTeamProperties,
} from './Rotation.types.js';
import {
  dateToState,
  parseDate,
} from '../utils/date.js';
import {
  RotationEditCardContent,
  RotationEditCardEditWrapper,
  RotationEditCardTeamWrapper,
  RotationEditCardWrapper,
  RotationEditListDragHandle,
  RotationEditTeamAddButton,
  RotationEditTeamCardContent,
  RotationEditTeamCardDragHorizontalHandle,
  RotationEditTeamCardDragVerticalHandle,
  RotationEditTeamCardEditing,
  RotationEditTeamMemberAdd,
  RotationEditTeamMemberList,
  RotationEditTeamMemberListItem,
  RotationEditTeamMemberListItemActions,
} from './Rotation.edit.style.js';
import {
  generateTeamList,
  generateTeamMember,
} from '../state/seed.js';
import type { RotationTeamMemberType } from '../state/types.js';
import {
  DndSort,
  DndSortDragHandleHorizontal,
  DndSortDragHandleVertical,
} from './DndSort.jsx';
import { useDndSortable } from '../hooks/useDndSortable.js';
import { rotationsAtom } from '../state/atoms.js';
import { useIsBelowLg } from '../hooks/useIsBelowLg.js';

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
  index: number,
  onClick: () => void,
};
export function RotationEditTeamMember({
  atom,
  index,
  onClick,
}: RotationEditTeamMemberProperties) {
  const { id } = useAtomValue(atom);
  const nameAtom = useMemo(
    () => focusAtom(
      atom,
      (optics) => optics.prop('name'),
    ),
    [atom],
  );
  const {
    rootProps, dragHandleProps,
  } = useDndSortable(atom);
  return (
    <RotationEditTeamMemberListItem
      key={id}
      {...rootProps}
      secondaryAction={(
        <RotationEditTeamMemberListItemActions>
          <IconButton
            edge="end"
            aria-label="delete"
            color="error"
            onClick={onClick}
          >
            <Delete />
          </IconButton>
          <RotationEditListDragHandle {...dragHandleProps} transparent />
        </RotationEditTeamMemberListItemActions>
      )}
    >
      <RotationEditTextField
        label={`Member #${index + 1}`}
        atom={nameAtom}
        fullWidth
      />
    </RotationEditTeamMemberListItem>
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
    <DndSort atom={atom}>
      <RotationEditTeamMemberList sx={{ flex: 1 }}>
        {membersList.map((member, index) => (
          <RotationEditTeamMember
            index={index}
            atom={members[index]}
            onClick={removeMember(member.id)}
          />
        ))}
      </RotationEditTeamMemberList>
      <RotationEditTeamMemberList>
        <RotationEditTeamMemberListItem>
          <RotationEditTeamMemberAdd onClick={addMember}>
            <PlusOne />
          </RotationEditTeamMemberAdd>
        </RotationEditTeamMemberListItem>
      </RotationEditTeamMemberList>
    </DndSort>
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
  const isBelowLg = useIsBelowLg();
  const DragHandleHorizontal = isBelowLg
    ? RotationEditTeamCardDragHorizontalHandle
    : () => (<></>);
  const DragHandleVertical = isBelowLg
    ? () => (<></>)
    : RotationEditTeamCardDragVerticalHandle;
  return (
    <RotationEditTeamCardContent {...rootProps}>
      <DragHandleHorizontal {...dragHandleProps} />
      <RotationEditTeamCardEditing>
        <RotationEditTextField atom={nameAtom} label={`Team #${index + 1} Name`} />
        <RotationEditTeamList atom={listAtom} />
        <Button color="error" onClick={onRemove}>Remove Team</Button>
      </RotationEditTeamCardEditing>
      <DragHandleVertical {...dragHandleProps} />
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
      <RotationEditCardTeamWrapper>
        {teamsList.map((team, index) => (
          <RotationEditTeamEdit
            atom={teams[index]}
            onRemove={removeTeam(team.id)}
            index={index}
            key={team.id}
          />
        ))}
      </RotationEditCardTeamWrapper>
      <RotationEditTeamAddButton onClick={addTeam}>
        <PlusOne />
      </RotationEditTeamAddButton>
    </DndSort>
  );
}

export type RotationEditDuplicateProperties = {
  onDuplicate: () => void;
} & RotationRootEditProperties;

export function RotationEditDuplicate({
  atom,
  onDuplicate,
}: RotationEditDuplicateProperties) {
  const setRotations = useSetAtom(rotationsAtom);
  const rotation = useAtomValue(atom);
  const duplicate = () => {
    setRotations((oldRotations) => [
      ...oldRotations,
      {
        ...rotation,
        id: nanoid(),
      },
    ]);
    onDuplicate();
  };
  return (
    <Button color="secondary" onClick={duplicate}>Duplicate Rotation</Button>
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
  const isBelowLg = useIsBelowLg();
  const DragHandle = isBelowLg
    ? DndSortDragHandleHorizontal
    : DndSortDragHandleVertical;
  return (
    <RotationEditCardWrapper>
      <RotationEditCardEditWrapper>
        <DragHandle {...dndProps} />
        <RotationEditCardContent>
          <RotationEditNameField atom={atom} />
          <RotationEditEveryField atom={atom} />
          <RotationEditStartDateField atom={atom} />
        </RotationEditCardContent>
        <RotationEditAllTeams atom={atom} />
      </RotationEditCardEditWrapper>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="error" onClick={onRemove}>Delete this Rotation</Button>
        <RotationEditDuplicate atom={atom} onDuplicate={onToggle} />
        <Button color="primary" onClick={onToggle}>Done</Button>
      </CardActions>
    </RotationEditCardWrapper>
  );
}
