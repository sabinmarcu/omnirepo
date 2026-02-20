import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { navigationBlockOffset } from './Navigation.css';

export const navigationAnchorStyle = style({
  position: 'absolute',
  insetBlockStart: `calc(0px - ${navigationBlockOffset})`,
});

globalStyle(`:has(> ${navigationAnchorStyle})`, {
  position: 'relative',
});