import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const experienceItemSkillsStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.grid.xs,
  marginBlockStart: theme.grid.m,
});

globalStyle(`${experienceItemSkillsStyle}:only-child`, {
  marginBlockStart: 0,
});
