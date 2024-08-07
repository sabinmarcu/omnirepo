import
{ styled } from '@mui/material';
import type { ButtonsLocationProperties } from './TitleEditor.tsx';

export const TitleEditorWrapper = styled('div')<ButtonsLocationProperties>(({ location }) => ({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: location === 'left' ? 'flex-start' : 'flex-end',
  paddingBlock: '0.2rem',
  flex: 1,
}));
