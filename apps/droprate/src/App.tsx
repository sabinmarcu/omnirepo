import { ThemeProvider } from '@sabinmarcu/mui-material-theme';
import { GlobalStyles } from './GlobalStyles.js';
import { ThemeSelector } from './components/ThemeSelector.js';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { DevTools } from './DevTools.js';
import { CounterSection } from './components/CounterSection.js';
import { RunsList } from './components/RunsList.js';
import { ProbabilityRunsList } from './components/ProbabilityRunsList.js';
import { Header } from './components/Header.js';
import { Break } from './components/Display.js';

function App() {
  return (
    <>
      <DevTools />
      <ThemeProvider>
        <GlobalStyles />
        <Header>
          Calculate drop rates
        </Header>
        <ThemeSelector />
        <CounterSection />
        <Break />
        <RunsList />
        <Break />
        <ProbabilityRunsList />
      </ThemeProvider>
    </>
  );
}

export default App;
