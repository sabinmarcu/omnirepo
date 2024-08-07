import {
  Button,
  Input,
  Typography,
  styled as muiStyled,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  Paper,
} from './Display.js';

export const CounterButton = muiStyled(Button)({
  fontSize: '2rem',
  padding: '0rem',
}, ({ theme }) => ({
  color: theme.palette.text.disabled,
}));

export const CounterWrapper = styled.article({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '1rem',
});

export const CounterSurface = styled(Paper)({
  padding: '1rem',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '1rem',
  fontSize: '1.2rem',
});

export const CounterText = styled(Typography)({
  width: '2.5rem',
  '&:first-of-type': {
    paddingInlineStart: '1rem',
  },
  '&:last-of-type': {
    paddingInlineEnd: '1rem',
  },
});

export const CounterInput = muiStyled(Input)({
  '& .MuiInputBase-input': {
    textAlign: 'center !important',
  },
});
