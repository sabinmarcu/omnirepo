import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { cvPageSpacing } from '../page.css';

export const publicationsListStyles = style({
  paddingBlockEnd: cvPageSpacing,
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: cvPageSpacing,
  selectors: {
    '&&': {
      paddingInlineStart: 0,
    },
  },
});

globalStyle([
  publicationsListStyles,
  `${publicationsListStyles} ul`,
].join(', '), {
  paddingInlineStart: cvPageSpacing,
  marginBlockStart: cvPageSpacing,
  vars: {
    [cvPageSpacing]: theme.grid.s,
  },
});
