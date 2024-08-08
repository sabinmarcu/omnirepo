import {
  CardContent,
  IconButton,
  List,
  ListItem,
  Typography,
  styled,
} from '@mui/material';
import type { CSSProperties } from 'react';

export const RotationMetadataCard = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingInlineStart: '2rem',
  [theme.breakpoints.down('lg')]: {
    alignItems: 'center',
  },
}));

export const RotationDisplayListsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '0.2rem',
  [theme.breakpoints.down('lg')]: {
    flexFlow: 'row wrap',
  },
}));

export const RotationDisplayListCardContent = styled(CardContent)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light'
    ? `rgb(from ${theme.palette.background.default} ${[
      'r',
      'g',
      'b',
    ]
      .map((it) => `calc(${it} * 0.95)`)
      .join(' ')})`
    : `rgb(from ${theme.palette.background.default} ${[
      'r',
      'g',
      'b',
    ]
      .map((it) => `calc(${it} / 0.9)`)
      .join(' ')})`;
  return {
    background: backgroundColor,
    padding: 0,
    flex: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    '&:last-child': {
      padding: 0,
    },
  };
});

export const RotationDisplayTeamNameWrapper = styled('div')(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light'
    ? `rgb(from ${theme.palette.background.default} ${[
      'r',
      'g',
      'b',
    ]
      .map((it) => `calc(${it} * 0.8)`)
      .join(' ')})`
    : `rgb(from ${theme.palette.background.default} ${[
      'r',
      'g',
      'b',
    ]
      .map((it) => `calc(${it} * 0.5)`)
      .join(' ')})`;
  const color = theme.palette.mode === 'light'
    ? 'black'
    : 'white';
  return {
    background: backgroundColor,
    color,
    textAlign: 'center',
    paddingInline: '1rem',
    paddingBlockStart: '1rem',
    paddingBlockEnd: '0.5rem',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    gap: '0.5rem',
  };
});

export const RotationDisplayTeamName = styled(Typography)({
  flex: 1,
  padding: 0,
  minWidth: '75px',
});

export const RotationDisplayList = styled(List)({
  padding: 0,
  flex: 1,
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
});

export const RotationDisplayListItem = styled(ListItem)<{ level?: number }>(
  ({
    theme,
    level = 0,
  }) => {
    const borderStyle = `solid 1px ${theme.palette.divider}`;
    const borderStyles = (
      (level === 0 && {
        borderBlock: borderStyle,
      })
      || (level === -1 && {
        borderBlockStart: borderStyle,
      })
      || (level === 1 && {
        borderBlockEnd: borderStyle,
      })
      || {}
    ) satisfies CSSProperties;
    return {
      ...borderStyles,
      paddingInline: '2rem',
      cursor: 'default',
      transition: theme.transitions.create('background'),
      opacity: 1 - Math.sqrt(0.4 * Math.abs(level)),
      '&:hover': {
        background: `rgba(from ${theme.palette.background.default} r g b / 0.3)`,
      },
    };
  },
);

export const RotationDisplayEditButton = styled(IconButton)({
  insetBlockStart: '0.5rem',
  insetInlineStart: '0.5rem',
  '&&': {
    position: 'absolute',
  },
});
