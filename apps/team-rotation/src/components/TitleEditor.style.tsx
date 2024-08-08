import
{ styled } from '@mui/material';

export type LocationProperties = {
  location?: 'left' | 'right'
};

export const TitleEditorWrapper = styled('div')<LocationProperties>(({ location }) => ({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: location === 'left' ? 'flex-start' : 'flex-end',
  paddingBlock: '0.2rem',
  flex: 1,
}));
