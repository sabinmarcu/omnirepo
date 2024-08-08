import {
  Button,
  styled,
} from '@mui/material';

export const RotationsListWrapper = styled('section')<{ spacing?: number }>(({
  spacing = 1.5,
  theme,
}) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: `${spacing}rem`,
  alignItems: 'center',
  width: '100%',
  paddingInline: `${spacing}rem`,
  paddingBlock: `${spacing * 1.5}rem`,
  boxSizing: 'border-box',
  [theme.breakpoints.down('lg')]: {
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    paddingInlineEnd: `${spacing * 2}rem`,
  },
}));

export const RotationListAddButton = styled(Button)(({ theme }) => {
  const backgroundColor = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} ${theme.palette.mode === 'light' ? '* 1' : '/ 0.8'})`,
  ).join(' ');
  const hoverBackgroundColor = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} ${theme.palette.mode === 'light' ? '* 0.8' : '* 1'})`,
  ).join(' ');
  return {
    padding: '3rem',
    margin: '1rem',
    justifySelf: 'center',
    background: `rgb(from ${theme.palette.background.paper} ${backgroundColor})`,
    color: theme.palette.text.primary,
    '& svg': {
      fontSize: '3rem',
    },
    '&:hover': {
      background: `rgb(from ${theme.palette.background.paper} ${hoverBackgroundColor})`,
    },
  };
});
