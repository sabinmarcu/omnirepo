import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const iconSize = createVar('icon-size');
globalStyle('body', {
  vars: {
    [iconSize]: '1.2em',
  },
});

export const iconStyle = style({
  aspectRatio: '1',
  inlineSize: iconSize,
});

globalStyle(`${iconStyle} svg`, {
  aspectRatio: '1',
  inlineSize: iconSize,
  fill: 'currentColor',
});

globalStyle(`${iconStyle} svg path`, {
  aspectRatio: '1',
  inlineSize: iconSize,
  fill: 'currentColor',
});
