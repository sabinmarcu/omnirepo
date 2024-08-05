/* eslint-disable unicorn/prevent-abbreviations */
import { useAtom } from 'jotai';
import { DevTools as JotaiDevTools } from 'jotai-devtools';
import { themeAtom } from './state/theme';
import 'jotai-devtools/styles.css';

export function DevTools() {
  const [theme] = useAtom(themeAtom);
  return (
    <JotaiDevTools isInitialOpen theme={theme} />
  );
}
