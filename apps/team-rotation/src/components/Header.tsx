import {
  AppBar,
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { TitleEditor } from './TitleEditor.tsx';
import { HeaderToolbar } from './Header.style.tsx';
import {
  pageTitleAtom,
} from '../state/atoms.ts';

export function Header() {
  return (
    <AppBar position="static" sx={{ paddingBlock: '1rem' }}>
      <Container>
        <HeaderToolbar>
          <TitleEditor atom={pageTitleAtom} label="Team Name" />
          <ThemeSelector />
        </HeaderToolbar>
      </Container>
    </AppBar>
  );
}