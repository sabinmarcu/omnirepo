import {
  AppBar,
  Container,
} from '@mui/material';
import { ThemeSelector } from '@sabinmarcu/mui-material-theme';
import { PageTitle } from './PageTitle.tsx';
import { HeaderToolbar } from './Header.style.tsx';

export function Header() {
  return (
    <AppBar position="static">
      <Container>
        <HeaderToolbar>
          <PageTitle />
          <ThemeSelector />
        </HeaderToolbar>
      </Container>
    </AppBar>
  );
}
