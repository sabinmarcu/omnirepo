import {
  Button,
  CardContent,
  ListItemButton,
  ListItem,
  List,
  styled,
} from '@mui/material';
import {
  DndSortDragHandleVertical,
  DndSortDragHandleHorizontal,
} from './DndSort.tsx';

export const RotationEditCardWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
});

export const RotationEditCardEditWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '0.2rem',
  [theme.breakpoints.down('lg')]: {
    flexFlow: 'column nowrap',
  },
}));

export const RotationEditCardTeamWrapper = styled(RotationEditCardEditWrapper)({
  gap: 0,
  overflow: 'hidden',
});

export const RotationEditCardContent = styled(CardContent)({
  display: 'flex',
  flexFlow: 'column nowrap',
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
    flexFlow: 'row nowrap',
    [theme.breakpoints.down('lg')]: {
      marginBlockStart: '1rem',
      marginInline: '1rem',
      paddingInline: '1.5rem',
      paddingBlockStart: '2rem',
      paddingBlockEnd: '1rem',
      flexFlow: 'column nowrap',
      '&:first-of-type': {
        marginBlockStart: 0,
      },
    },
  });
});

export const RotationEditTeamCardEditing = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
  flex: 1,
  minWidth: '250px',
});

export const RotationEditTeamCardDragVerticalHandle = styled(DndSortDragHandleVertical)({
  background: 'rgba(from black r g b / 0.2)',
  marginBlock: '-1rem',
  marginInlineEnd: '-1rem',
});

export const RotationEditTeamCardDragHorizontalHandle = styled(DndSortDragHandleHorizontal)({
  background: 'rgba(from black r g b / 0.2)',
  marginBlockStart: '-2rem',
  marginInline: '-1.5rem',
  marginBlockEnd: '2rem',
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
  overflow: 'hidden',
});

export const RotationEditTeamMemberListItem = styled(ListItem)({
  paddingInline: 0,
});

export const RotationEditTeamMemberAdd = styled(ListItemButton)({
  justifyContent: 'center',
});

export const RotationEditTeamMemberListItemActions = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const RotationEditListDragHandle = styled(DndSortDragHandleHorizontal)({
  paddingBlock: '1rem',
  paddingInline: '1rem',
  '&:first-child': {
    paddingInlineStart: 0,
  },
  '&:last-child': {
    paddingInlineEnd: 0,
  },
  backgrounspd: 'transparent',
});