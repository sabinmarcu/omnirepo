import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';

export const languageItemStyles = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: theme.grid.xxl,
  fontWeight: 'bold',
  lineHeight: '1.25em',
});
