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
import type { WritableAtom } from 'jotai/vanilla';
import { TitleEditorWrapper } from './TitleEditor.style.tsx';

export interface StringAtomProperties {
  atom: WritableAtom<string, [string], void>
}

export interface InteractionProperties extends StringAtomProperties {
  onClick: () => void;
}

export interface InteractionButtonProperties extends ComponentProps<typeof IconButton> {
  icon: typeof Edit,
}

const TitleEditorInteraction = forwardRef<HTMLButtonElement, InteractionButtonProperties>(
  ({
    icon: Icon, ...rest
  }, reference) => (
    <IconButton ref={reference} {...rest}>
      <Icon style={{ fontSize: '1em' }} />
    </IconButton>
  ),
);

export function TitleEditorDisplay({
  onClick,
  atom,
}: InteractionProperties) {
  const title = useAtomValue(atom);
  return (
    <>
      <Typography variant="h4">{title}</Typography>
      <TitleEditorInteraction onClick={onClick} icon={Edit} />
    </>
  );
}

export function TitleEditorEdit({
  onClick,
  atom,
}: InteractionProperties) {
  const [
    title,
    setTitle,
  ] = useAtom(atom);
  const [
    input,
    setInput,
  ] = useState(title);
  const onChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
    setInput(value);
  };
  const onSave = () => {
    setTitle(input);
    onClick();
  };
  return (
    <>
      <TextField
        value={input}
        onChange={onChange}
        label="Team Name"
      />
      <TitleEditorInteraction onClick={onSave} color="success" icon={Check} />
      <TitleEditorInteraction onClick={onClick} color="error" icon={Close} />
    </>
  );
}

export function TitleEditor({ atom }: StringAtomProperties) {
  const [
    editing,
    setEditing,
  ] = useState(false);
  const toggleEdit = () => setEditing((previous) => !previous);
  return (
    <TitleEditorWrapper>
      {editing
        ? (<TitleEditorEdit onClick={toggleEdit} atom={atom} />)
        : (<TitleEditorDisplay onClick={toggleEdit} atom={atom} />)}
    </TitleEditorWrapper>
  );
}
