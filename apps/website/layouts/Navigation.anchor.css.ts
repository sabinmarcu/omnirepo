import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  animatedNavigationSelector,
  navigationMinSize,
  navigationSelector,
  navigationSpacing,
} from './Navigation.css';
import { grids } from './Navigation.grid';

const navigationAnchorOffset = createVar();
export const navigationAnchorStyle = style({
  position: 'absolute',
  insetBlockStart: `calc(0px - ${navigationAnchorOffset})`,
});

globalStyle('body', {
  vars: {
    [navigationAnchorOffset]: '0px',
  },
});

globalStyle(`:has(> ${navigationAnchorStyle})`, {
  position: 'relative',
});

globalStyle(`body:has(${navigationSelector})`, {
  vars: {
    [navigationAnchorOffset]: `calc(${navigationMinSize} + ${navigationSpacing} * 3)`,
  },
});

globalStyle(`body:has(${navigationSelector} ${grids.rawSelector('minor')})`, {
  vars: {
    [navigationAnchorOffset]: `calc(${navigationMinSize} * 2 + ${navigationSpacing} * 3)`,
  },
});

globalStyle(`body:has(${navigationSelector}${animatedNavigationSelector})`, {
  vars: {
    [navigationAnchorOffset]: navigationMinSize,
  },
});

globalStyle(`body:has(${navigationSelector}${animatedNavigationSelector} ${grids.rawSelector('minor')})`, {
  vars: {
    [navigationAnchorOffset]: `calc(${navigationMinSize} * 2)`,
  },
});
