import {
  useAtom,
  useAtomValue,
} from 'jotai/react';
import {
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  Check,
  Close,
  Edit,
} from '@mui/icons-material';
import type {
  ChangeEvent,
  ComponentProps,
} from 'react';
import {
  forwardRef,
  useState,
} from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PrimitiveAtom } from 'jotai';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { TitleEditorWrapper } from './TitleEditor.style.tsx';
import { dateToState } from '../utils/date.ts';

export type Encoder = {
  encode: (input: string) => string,
  decode: (input: string) => string,
};

export type ButtonProperties = ComponentProps<typeof IconButton>;
export type InputProperties = ComponentProps<typeof TextField>;

export type LocationProperties = {
  location?: 'left' | 'right'
};

export type InteractionButtonProperties = {
  icon: typeof Edit
} & ButtonProperties;

export type SharedProperties = {
  atom: PrimitiveAtom<string>,
} & LocationProperties;

export type InnerProperties = {
  onClick: () => void,
};

export type SharedInnerProperties =
& InnerProperties
& SharedProperties;

export type DisplayProperties = {
  format?: (input: string) => string,
} & SharedInnerProperties;

export type EditorProperties = {
  label: string,
  // eslint-disable-next-line react/no-unused-prop-types
  type?: InputProperties['type'],
} & SharedInnerProperties;

export type TitleEditorProperties = Omit<
  & EditorProperties
  & DisplayProperties,
keyof InnerProperties>;

const TitleEditorInteraction = forwardRef<HTMLButtonElement, InteractionButtonProperties>(
  ({
    icon: Icon,
    ...rest
  }, reference) => (
    <IconButton ref={reference} {...rest}>
      <Icon style={{ fontSize: '1em' }} />
    </IconButton>
  ),
);

export function TitleEditorDisplay({
  onClick,
  atom,
  location,
  format,
}: DisplayProperties) {
  const title = useAtomValue(atom);
  const display = format ? format(title) : title;
  if (location === 'left') {
    return (
      <>
        <Typography variant="h4">{display}</Typography>
        <TitleEditorInteraction onClick={onClick} icon={Edit} />
      </>
    );
  }
  return (
    <>
      <TitleEditorInteraction onClick={onClick} icon={Edit} />
      <Typography variant="h4">{display}</Typography>
    </>
  );
}

export function TitleEditorTextInput({
  atom,
  label,
  location,
  onClick,
}: EditorProperties) {
  const [
    outerValue,
    setOuterValue,
  ] = useAtom(atom);
  const [
    input,
    setInput,
  ] = useState(outerValue);
  const onChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
    setInput(value);
  };
  const onSave = () => {
    setOuterValue(input);
    onClick();
  };
  if (location === 'left') {
    return (
      <>
        <TextField
          value={input}
          onChange={onChange}
          label={label}
        />
        <TitleEditorInteraction onClick={onSave} color="success" icon={Check} />
        <TitleEditorInteraction onClick={onClick} color="error" icon={Close} />
      </>
    );
  }
  return (
    <>
      <TitleEditorInteraction onClick={onClick} color="error" icon={Close} />
      <TitleEditorInteraction onClick={onSave} color="success" icon={Check} />
      <TextField
        value={input}
        onChange={onChange}
        label={label}
      />
    </>
  );
}

export function TitleEditorDateInput({
  atom,
  label,
  location,
  onClick,
}: EditorProperties) {
  const [
    outerValue,
    setOuterValue,
  ] = useAtom(atom);
  const [
    input,
    setInput,
  ] = useState(dayjs(outerValue, 'DD.MM.YYYY'));
  const onChange = (value: Dayjs | null) => {
    if (value) {
      setInput(value);
    }
  };
  const onSave = () => {
    setOuterValue(dateToState(input));
    onClick();
  };
  if (location === 'left') {
    return (
      <>
        <DatePicker
          value={input}
          label={label}
          onChange={onChange}
        />
        <TitleEditorInteraction onClick={onSave} color="success" icon={Check} />
        <TitleEditorInteraction onClick={onClick} color="error" icon={Close} />
      </>
    );
  }
  return (
    <>
      <TitleEditorInteraction onClick={onClick} color="error" icon={Close} />
      <TitleEditorInteraction onClick={onSave} color="success" icon={Check} />
      <DatePicker
        label={label}
        value={input}
        onChange={onChange}
      />
    </>
  );
}

export function TitleEditorEdit({
  type = 'text',
  ...editorProperties
}: EditorProperties) {
  if (type === 'text') {
    return <TitleEditorTextInput {...editorProperties} />;
  }
  return <TitleEditorDateInput {...editorProperties} />;
}

export function TitleEditor({
  atom,
  type,
  location = 'left',
  label,
  format,
}: TitleEditorProperties) {
  const [
    editing,
    setEditing,
  ] = useState(false);
  const toggleEdit = () => setEditing((previous) => !previous);
  return (
    <TitleEditorWrapper location={location}>
      {editing
        ? (
          <TitleEditorEdit
            onClick={toggleEdit}
            atom={atom}
            type={type}
            location={location}
            label={label}
          />
        )
        : (
          <TitleEditorDisplay
            onClick={toggleEdit}
            atom={atom}
            location={location}
            format={format}
          />
        )}
    </TitleEditorWrapper>
  );
}
