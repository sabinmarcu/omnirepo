import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { navigationOffset } from './Navigation.css';

export const navigationAnchorStyle = style({
  position: 'absolute',
  insetBlockStart: `calc(0px - ${navigationOffset})`,
});

globalStyle(`:has(> ${navigationAnchorStyle})`, {
  position: 'relative',
});
