import {
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { TitleEditor } from './TitleEditor.tsx';
import {
  HeaderAppBar,
  HeaderToolbar,
} from './Header.style.tsx';
import {
  pageTitleAtom,
} from '../state/atoms.ts';

export function Header() {
  return (
    <HeaderAppBar
      position="sticky"
    >
      <Container>
        <HeaderToolbar>
          <TitleEditor atom={pageTitleAtom} label="Team Name" />
          <ThemeSelector />
        </HeaderToolbar>
      </Container>
    </HeaderAppBar>
  );
}
