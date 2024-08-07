/* eslint-disable unicorn/prevent-abbreviations */
import { ThemeProvider } from '@sabinmarcu/mui-material-theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GlobalStyles } from './GlobalStyles.js';
import { DevTools } from './DevTools.tsx';
import { Header } from './components/Header.tsx';
import { RotationsList } from './components/RotationsList.tsx';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ro">
      <ThemeProvider>
        <GlobalStyles />
        <Header />
        <RotationsList />
        <DevTools />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
