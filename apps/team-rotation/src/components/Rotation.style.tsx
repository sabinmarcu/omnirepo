import {
  Card,
  styled,
} from '@mui/material';

export const RotationCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  overflow: 'visible',
  [theme.breakpoints.down('lg')]: {
    flexFlow: 'column nowrap',
  },
  position: 'relative',
}));