import { style } from '@vanilla-extract/css';

export const wrappedPreStyle = style({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

export const wrappedLineStyle = style({
  minInlineSize: 0,
});

export const wrappedTokenStyle = style({
  textIndent: 0,
});
