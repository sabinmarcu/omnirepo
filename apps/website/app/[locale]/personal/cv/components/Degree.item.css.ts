import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { grids } from './Experience.item.grid';
import { experienceItemStyles } from './Experience.item.css';

export const degreeItemStyles = style({});

const overrideSelector = `${experienceItemStyles}${degreeItemStyles}`;
globalStyle(grids.extend('title', overrideSelector), {
  flexFlow: 'column nowrap',
  gap: theme.grid.s,
});

globalStyle(`${grids.extend('title', overrideSelector)} span:last-of-type:not(:only-child)`, {
  fontSize: theme.grid.m,
  opacity: 0.6,
});

