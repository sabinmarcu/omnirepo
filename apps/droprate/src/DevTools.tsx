/* eslint-disable unicorn/name-replacements */
import { DevTools as JotaiDevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import { useTheme } from '@sabinmarcu/mui-material-theme';

export function DevTools() {
  const theme = useTheme();
  return (
    <JotaiDevTools isInitialOpen theme={theme} />
  );
}
