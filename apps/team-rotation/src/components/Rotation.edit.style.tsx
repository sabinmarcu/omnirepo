import {
  Button,
  CardContent,
  ListItem,
  List,
  styled,
} from '@mui/material';

export const RotationEditCardWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
});

export const RotationEditCardEditWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '0.2rem',
});

export const RotationEditCardContent = styled(CardContent)({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '1rem',
});

export const RotationEditTeamCardContent = styled(RotationEditCardContent)(({ theme }) => {
  const background = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} / 0.8)`,
  ).join(' ');

  return ({
    background: `rgb(from ${theme.palette.background.default} ${background})`,
  });
});

export const RotationEditTeamAddButton = styled(Button)(({ theme }) => {
  const background = [
    'r',
    'g',
    'b',
  ].map(
    (it) => `calc(${it} / 0.8)`,
  ).join(' ');

  return ({
    background: `rgb(from ${theme.palette.background.default} ${background})`,
    color: theme.palette.text.primary,
    padding: '2rem',
    fontSize: '2rem',
  });
});

export const RotationEditTeamMemberList = styled(List)({
  flex: 1,
});

export const RotationEditTeamMemberListItem = styled(ListItem)({
  paddingInline: 0,
});