import {
  Button,
  styled,
} from '@mui/material';
import { Section } from './Section.js';
import { BodyText } from './Display.js';

export const StatsListSection = styled(Section)({
  flexFlow: 'row wrap',
});

export const StatsListDescription = styled(BodyText)({
  fontSize: '1.1rem',
  flex: '0 0 100%',
  textAlign: 'center',
});

export const StatsListActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1em',
  [theme.breakpoints.down('md')]: {
    flex: '0 0 100%',
  },
}));

export const StatsListAddButton = styled(Button)(({ theme }) => ({
  padding: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  background: `hsla(from ${theme.palette.background.paper} h s l / 0.6)`,
  '&:hover': { background: theme.palette.background.paper },
}));
