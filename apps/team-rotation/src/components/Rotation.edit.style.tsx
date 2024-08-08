import {
  Button,
  CardContent,
  ListItemButton,
  ListItem,
  List,
  styled,
} from '@mui/material';

export const RotationEditCardWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
});

export const RotationEditCardEditWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '0.2rem',
  [theme.breakpoints.down('lg')]: {
    // gap: '1rem',
    // padding: '1rem',
    flexFlow: 'column nowrap',
  },
}));

export const RotationEditCardContent = styled(CardContent)({
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'space-between',
  gap: '1rem',
});

export const RotationEditTeamCardContent = styled(RotationEditCardContent)(({ theme }) => {
  const backgroundShade = theme.palette.mode === 'light'
    ? '* 0.95'
    : '/ 0.8';
  const background = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} ${backgroundShade})`,
  ).join(' ');

  return ({
    background: `rgb(from ${theme.palette.background.default} ${background})`,
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      marginBlockStart: '1rem',
      marginInline: '1rem',
      paddingInline: '1.5rem',
      paddingBlockStart: '2rem',
      paddingBlockEnd: '1rem',
      '&:first-of-type': {
        marginBlockStart: 0,
      },
    },
  });
});

export const RotationEditTeamCardEditing = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
});

export const RotationEditTeamAddButton = styled(Button)(({ theme }) => {
  const backgroundShade = theme.palette.mode === 'light'
    ? '* 0.95'
    : '/ 0.8';
  const background = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} ${backgroundShade})`,
  ).join(' ');

  return ({
    background: `rgb(from ${theme.palette.background.default} ${background})`,
    color: theme.palette.text.primary,
    padding: '2rem',
    fontSize: '2rem',
    [theme.breakpoints.down('lg')]: {
      margin: '1rem',
    },
  });
});

export const RotationEditTeamMemberList = styled(List)({
  flex: 1,
});

export const RotationEditTeamMemberListItem = styled(ListItem)({
  paddingInline: 0,
});

export const RotationEditTeamMemberAdd = styled(ListItemButton)({
  justifyContent: 'center',
});
