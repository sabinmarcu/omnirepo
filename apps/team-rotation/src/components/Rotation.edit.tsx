import {
  Button,
  CardActions,
  TextField,
} from '@mui/material';
import {
  useAtom,
} from 'jotai';
import type { ChangeEvent } from 'react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { focusAtom } from 'jotai-optics';
import type { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import type { RotationProperties } from './Rotation.types.tsx';
import {
  dateToState,
  parseDate,
} from '../utils/date.ts';
import {
  RotationEditCardContent,
  RotationEditCardEditWrapper,
  RotationEditCardWrapper,
} from './Rotation.edit.style.tsx';

export type RotationRootEditProperties = Omit<RotationProperties, 'onToggle'>;

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
  const [
    name,
    setName,
  ] = useAtom(nameAtom);
  const onChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
    setName(value);
  };
  return (
    <TextField
      label="Rotation Name"
      value={name}
      onChange={onChange}
    />
  );
}

export function RotationEdit({
  atom, onToggle,
}: RotationProperties) {
  return (
    <RotationEditCardWrapper>
      <RotationEditCardEditWrapper>
        <RotationEditCardContent>
          <RotationEditNameField atom={atom} />
          <RotationEditEveryField atom={atom} />
          <RotationEditStartDateField atom={atom} />
        </RotationEditCardContent>
      </RotationEditCardEditWrapper>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={onToggle}>Done</Button>
      </CardActions>
    </RotationEditCardWrapper>
  );
}
