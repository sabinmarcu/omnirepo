import {
  CardContent,
  styled,
} from '@mui/material';

export const RotationEditCardWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'column nowrap',
});

export const RotationEditCardEditWrapper = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
});

export const RotationEditCardContent = styled(CardContent)({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '1rem',
  '&&': {
    paddingBlockEnd: 0,
  },
});