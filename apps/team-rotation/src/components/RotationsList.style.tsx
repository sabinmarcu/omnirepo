import { styled } from '@mui/material';

export const RotationsListWrapper = styled('section')<{ spacing?: number }>(({ spacing = 1 }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: `${spacing}rem`,
  alignItems: 'flex-start',
  width: '100%',
  padding: `${spacing}rem`,
  boxSizing: 'border-box',
}));
