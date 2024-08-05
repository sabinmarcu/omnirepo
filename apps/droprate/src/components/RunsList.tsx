import { useAtom } from 'jotai';
import {
  styled,
} from '@mui/material';
import { runsList } from '../state/atoms';
import { Section } from './Section';
import { Runs } from './Runs';
import { BodyText } from './Display';

const RunsListSection = styled(Section)({
  flexFlow: 'row wrap',
});

const RunsListDescription = styled(BodyText)({
  fontSize: '1.1rem',
  flex: '0 0 100%',
  textAlign: 'center',
});

export const RunsList = () => {
  const [runs] = useAtom(runsList);
  return (
    <RunsListSection>
      <RunsListDescription>
        Your chance of winning at least once
      </RunsListDescription>
      {runs.map((atom) => (
        <Runs atom={atom} key={atom.debugLabel} />
      ))}
    </RunsListSection>
  );
};
