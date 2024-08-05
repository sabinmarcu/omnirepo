import {
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import {
  BodyText,
  Paper,
} from './Display';

const StatsBase = styled(Paper)({
  display: 'flex',
  flexFlow: 'column nowrap',
  padding: '1rem',
  gap: '1rem',
  position: 'relative',
});

const StatsActions = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-end',
  position: 'absolute',
  insetBlockStart: '-0.5rem',
  insetInlineEnd: '-0.5rem',
});

const StatsActionButton = styled(IconButton)(({ theme }) => ({
  background: `hsla(from ${theme.palette.error.main} h s l / 0.3)`,
  '&:hover': {
    background: `hsla(from ${theme.palette.error.main} h s l / 0.8)`,
  },
  '& > *': {
    fontSize: 'inherit',
  },
}));

const StatsTop = styled('div')({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '1rem',
});

const StatsText = styled(BodyText)({
  flex: 0,
});
const StatsInput = styled(TextField)({});
const StatsResult = styled(Typography)(({ theme }) => ({
  background: theme.palette.background.default,
  padding: '1rem',
}));

export const Stats = StatsBase as (typeof StatsBase) & {
  Top: typeof StatsTop,
  Text: typeof StatsText,
  Input: typeof StatsInput,
  Result: typeof StatsResult,
  Actions: typeof StatsActions,
  ActionButton: typeof StatsActionButton,
};

Stats.Top = StatsTop;
Stats.Text = StatsText;
Stats.Input = StatsInput;
Stats.Result = StatsResult;
Stats.Actions = StatsActions;
Stats.ActionButton = StatsActionButton;
