import {
  AppBar,
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { TitleEditor } from './TitleEditor.tsx';
import { HeaderToolbar } from './Header.style.tsx';
import {
  pageTitleAtom,
  startDateAtom,
} from '../state/atoms.ts';
import { dateToState } from '../utils/date.ts';

export function Header() {
  return (
    <AppBar position="static">
      <Container>
        <HeaderToolbar>
          <TitleEditor atom={pageTitleAtom} label="Team Name" />
          <TitleEditor
            atom={startDateAtom}
            label="Start Date"
            location="right"
            type="date"
            format={(input: string) => dateToState(input)}
          />
          <ThemeSelector />
        </HeaderToolbar>
      </Container>
    </AppBar>
  );
}
