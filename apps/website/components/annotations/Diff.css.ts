import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import {
  gutterStyle,
  gutterSpacing,
} from './Gutter.css';

export const diffLineStyle = style({
  display: 'grid',
  gridTemplateColumns: `calc(${theme.grid.m} + ${gutterSpacing} * 2) minmax(0, 1fr)`,
});

export const diffMarkerStyle = style([
  gutterStyle,
  {
    userSelect: 'none',
    textAlign: 'center',
    opacity: 0.8,
  },
]);
