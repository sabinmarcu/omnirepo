import {
  AppBar,
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { TitleEditor } from './TitleEditor.tsx';
import { HeaderToolbar } from './Header.style.tsx';
import { pageTitleAtom } from '../state/atoms.ts';

export function Header() {
  return (
    <AppBar position="static">
      <Container>
        <HeaderToolbar>
          <TitleEditor atom={pageTitleAtom} />
          <ThemeSelector />
        </HeaderToolbar>
      </Container>
    </AppBar>
  );
}
