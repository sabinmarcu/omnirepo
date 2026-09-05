import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { gutterStyle } from './Gutter.css';

export const numberedLineStyle = style({
  display: 'flex',
  minInlineSize: 0,
});

globalStyle(`${numberedLineStyle} > div`, {
  minInlineSize: 0,
  flex: 1,
});

export const lineNumberStyle = style([
  gutterStyle,
  {
    flex: '0 0 1ch',
    userSelect: 'none',
    textAlign: 'end',
    opacity: 0.45,
  },
]);

globalStyle(`pre:has(${numberedLineStyle}:nth-child(10)) ${lineNumberStyle}`, {
  flexBasis: '2ch',
});

globalStyle(`pre:has(div:nth-child(10) ${numberedLineStyle}) ${lineNumberStyle}`, {
  flexBasis: '2ch',
});

globalStyle(`pre:has(${numberedLineStyle}:nth-child(100)) ${lineNumberStyle}`, {
  flexBasis: '3ch',
});

globalStyle(`pre:has(div:nth-child(100) ${numberedLineStyle}) ${lineNumberStyle}`, {
  flexBasis: '3ch',
});

