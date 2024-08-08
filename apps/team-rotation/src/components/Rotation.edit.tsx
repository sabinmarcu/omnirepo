import {
  Button,
  CardActions,
  CardContent,
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
    <>
      <CardContent>
        <RotationEditNameField atom={atom} />
        <RotationEditStartDateField atom={atom} />
      </CardContent>
      <CardActions>
        <Button color="secondary" onClick={onToggle}>Go Back</Button>
      </CardActions>
    </>
  );
}