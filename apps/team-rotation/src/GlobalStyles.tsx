import {
  Global,
} from '@emotion/react';
import { useTheme } from '@mui/material';

export function GlobalStyles() {
  const theme = useTheme();

  return (
    <Global styles={{
      'html, body, #root': {
        height: '100vh',
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
        position: 'relative',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      '#root': {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      },
    }}
    />
  );
}