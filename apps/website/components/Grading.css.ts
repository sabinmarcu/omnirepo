import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { iconSize } from './Icon.css';

export const gradingPipSelector = 'data-grading';

export const gradingSpacing = createVar();
export const gradingStyles = style({
  display: 'inline-flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  vars: {
    [iconSize]: `calc(1em - ${gradingSpacing} * 2)`,
    [gradingSpacing]: '0.15em',
  },
  gap: gradingSpacing,
});

globalStyle(`${gradingStyles} > [${gradingPipSelector}]`, {
  paddingBlock: gradingSpacing,
  display: 'inline-block',
});

globalStyle(`${gradingStyles} [${gradingPipSelector}=true]`, {
  color: theme.colors.primary.base,
});

globalStyle(`${gradingStyles} [${gradingPipSelector}=false]`, {
  opacity: 0.2,
});

