import {
  Paper,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { BodyText } from './Display';

const StatsBase = styled(Paper)({
  display: 'flex',
  flexFlow: 'column nowrap',
  padding: '1rem',
  gap: '1rem',
});

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
};

Stats.Top = StatsTop;
Stats.Text = StatsText;
Stats.Input = StatsInput;
Stats.Result = StatsResult;
