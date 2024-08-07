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
  useRef,
} from 'react';
import { pageTitleAtom } from '../state/atoms.ts';
import { PageTitleWrapper } from './PageTitle.style.tsx';

export interface InteractionProperties {
  onClick: () => void;
}

export interface InteractionButtonProperties extends ComponentProps<typeof IconButton> {
  icon: typeof Edit,
}

const PageTitleInteraction = forwardRef<HTMLButtonElement, InteractionButtonProperties>(
  ({
    icon: Icon, ...rest
  }, reference) => (
    <IconButton ref={reference} {...rest}>
      <Icon style={{ fontSize: '1em' }} />
    </IconButton>
  ),
);

export function PageTitleDisplay({ onClick }: InteractionProperties) {
  const title = useAtomValue(pageTitleAtom);
  return (
    <>
      <Typography variant="h4">{title}</Typography>
      <PageTitleInteraction onClick={onClick} icon={Edit} />
    </>
  );
}

export function PageTitleEdit({ onClick }: InteractionProperties) {
  const [
    title,
    setTitle,
  ] = useAtom(pageTitleAtom);
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
      <PageTitleInteraction onClick={onSave} color="success" icon={Check} />
      <PageTitleInteraction onClick={onClick} color="error" icon={Close} />
    </>
  );
}

export function PageTitle() {
  const [
    editing,
    setEditing,
  ] = useState(false);
  const toggleEdit = () => setEditing((previous) => !previous);
  return (
    <PageTitleWrapper>
      {editing
        ? (<PageTitleEdit onClick={toggleEdit} />)
        : (<PageTitleDisplay onClick={toggleEdit} />)}
    </PageTitleWrapper>
  );
}
