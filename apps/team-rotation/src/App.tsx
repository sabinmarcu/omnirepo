/* eslint-disable unicorn/prevent-abbreviations */
import { ThemeProvider } from '@sabinmarcu/mui-material-theme';
import { GlobalStyles } from './GlobalStyles.js';
import { DevTools } from './DevTools.tsx';
import { Header } from './components/Header.tsx';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Header />
      <h1>Hello</h1>
      <DevTools />
    </ThemeProvider>
  );
}

export default App;
