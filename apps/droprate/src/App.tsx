import { ThemeProvider } from './components/ThemeProvider';
import { GlobalStyles } from './GlobalStyles';
import { ThemeSelector } from './components/ThemeSelector';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { DevTools } from './DevTools';
import { CounterSection } from './components/CounterSection';
import {
  Heading,
  HeadingSection,
} from './App.style';
import { RunsList } from './components/RunsList';

function App() {
  return (
    <>
      <DevTools />
      <ThemeProvider>
        <GlobalStyles />
        <ThemeSelector />
        <HeadingSection>
          <Heading>Calculate drop rates</Heading>
        </HeadingSection>
        <CounterSection />
        <RunsList />
      </ThemeProvider>
    </>
  );
}

export default App;
