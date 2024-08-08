import { styled } from '@mui/material';

export const RotationsListWrapper = styled('section')<{ spacing?: number }>(({
  spacing = 1.5,
  theme,
}) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: `${spacing}rem`,
  alignItems: 'flex-start',
  width: '100%',
  paddingInline: `${spacing}rem`,
  paddingBlock: `${spacing * 1.5}rem`,
  boxSizing: 'border-box',
  [theme.breakpoints.down('lg')]: {
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
}));
