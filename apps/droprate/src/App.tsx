import { ThemeProvider } from './components/ThemeProvider';
import { GlobalStyles } from './GlobalStyles';
import { ThemeSelector } from './components/ThemeSelector';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { DevTools } from './DevTools';
import { CounterSection } from './components/CounterSection';
import { RunsList } from './components/RunsList';
import { ProbabilityRunsList } from './components/ProbabilityRunsList';
import { Header } from './components/Header';
import { Break } from './components/Display';

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
