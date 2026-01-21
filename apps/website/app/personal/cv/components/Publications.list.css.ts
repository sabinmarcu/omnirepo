import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { cvPageSpacing } from '../page.css';

export const publicationsListStyles = style({
  paddingBlockEnd: cvPageSpacing,
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: cvPageSpacing,
});

globalStyle([
  publicationsListStyles,
  `${publicationsListStyles} ul`,
].join(', '), {
  paddingInlineStart: cvPageSpacing,
});
