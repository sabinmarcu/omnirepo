import {
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { TitleEditor } from './TitleEditor.jsx';
import {
  HeaderAppBar,
  HeaderToolbar,
} from './Header.style.jsx';
import {
  pageTitleAtom,
} from '../state/atoms.js';

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
