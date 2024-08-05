import {
  styled,
  Typography,
} from '@mui/material';
import { Section } from './components/Section';

export const HeadingSection = styled(Section)(({ theme }) => {
  const color = theme.palette.mode === 'light' ? '0' : '255';
  return ({
    background: `linear-gradient(0, rgba(${color}, ${color}, ${color}, 0.1), transparent 25%)`,
    paddingBlock: '6cqh 4cqh',
  });
});

export const Heading = styled(Typography)(() => ({
  opacity: 0.3,
  fontSize: '4rem',
  lineHeight: '5rem',
  textAlign: 'center',
  filter: 'blur(1px)',
}));
