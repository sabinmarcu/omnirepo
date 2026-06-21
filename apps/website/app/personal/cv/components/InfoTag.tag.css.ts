import { theme } from '@sabinmarcu/website-theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const iconSize = createVar();
export const infoTagStyles = style({
  gap: theme.grid.s,
  vars: {
    [iconSize]: '1.5em',
  },
});

globalStyle([
  infoTagStyles,
  `${infoTagStyles} [data-info-text]`,
].join(', '), {
  display: 'inline-flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${infoTagStyles} > :is([data-info-icon], [data-info-icon-text])`, {
  aspectRatio: '1',
  display: 'grid',
  placeItems: 'center',
  inlineSize: iconSize,
  boxSizing: 'border-box',
});

globalStyle(`${infoTagStyles} > [data-info-icon-text]`, {
  fontSize: iconSize,
});
