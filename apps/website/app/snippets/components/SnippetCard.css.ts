import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const snippetCardStyle = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  containerType: 'inline-size',

  overflow: 'hidden',

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  background: theme.colors.background.surface,
});

globalStyle(`${snippetCardStyle} h2`, {
  fontSize: `calc(${theme.grid.xxl} * 1.5)`,

  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
});
