import {
  styled,
  Typography,
  Paper as MUIPaper,
} from '@mui/material';

export const BodyText = styled(Typography)({
  opacity: 0.4,
});

export const BodyDescription = styled(Typography)({
  opacity: 0.2,
});

export const Paper = styled(MUIPaper)({
  backgroundImage: 'none',
});

export const Break = styled('hr')(({ theme }) => ({
  border: 0,
  height: '2px',
  width: '100%',
  marginBlock: '2rem',
  background: theme.palette.divider,
}));
