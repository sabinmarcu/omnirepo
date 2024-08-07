import {
  CardContent,
  List,
  ListItem,
  Typography,
  styled,
} from '@mui/material';

export const RotationMetadataCard = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingInlineStart: '2rem',
  [theme.breakpoints.down('lg')]: {
    alignItems: 'center',
  },
}));

export const RotationDisplayListsWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '0.2rem',
});

export const RotationDisplayListCardContent = styled(CardContent)(({ theme }) => ({
  background: `rgba(from ${theme.palette.background.default} r g b / 0.5)`,
  padding: 0,
  flex: 1,
}));

export const RotationDisplayTeamName = styled(Typography)(({ theme }) => ({
  background: `rgba(from ${theme.palette.background.default} r g b / 0.7)`,
  textAlign: 'center',
  paddingInline: '1rem',
  paddingBlockStart: '1rem',
  paddingBlockEnd: '0.5rem',
}));

export const RotationDisplayList = styled(List)({
  padding: 0,
});

export const RotationDisplayListItem = styled(ListItem)(({ theme }) => ({
  paddingInline: '2rem',
  borderBlockEnd: `solid 1px ${theme.palette.divider}`,
  cursor: 'default',
  transition: theme.transitions.create('background'),
  '&:last-of-type': {
    borderBlockEnd: 'none',
  },
  '&:first-of-type': {
    borderBlockStart: `solid 1px ${theme.palette.divider}`,
  },
  '&:hover': {
    background: `rgba(from ${theme.palette.background.default} r g b / 0.3)`,
  },
}));