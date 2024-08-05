import { ThemeProvider } from './components/ThemeProvider';
import { GlobalStyles } from './GlobalStyles';
import { ThemeSelector } from './components/ThemeSelector';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { DevTools } from './DevTools';
import { CounterSection } from './components/CounterSection';
import { RunsList } from './components/RunsList';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <DevTools />
      <ThemeProvider>
        <GlobalStyles />
        <ThemeSelector />
        <Header>
          Calculate drop rates
        </Header>
        <CounterSection />
        <RunsList />
      </ThemeProvider>
    </>
  );
}

export default App;
