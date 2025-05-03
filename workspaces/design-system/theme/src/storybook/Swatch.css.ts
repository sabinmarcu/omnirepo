import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const swatchStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(50ch, 1fr))',

  minBlockSize: '30ch',

  marginBlockStart: '2rem',
  marginBlockEnd: '2rem',
  marginInlineStart: '2rem',
  marginInlineEnd: '2rem',

  borderStartStartRadius: '0.25rem',
  borderStartEndRadius: '0.25rem',
  borderEndEndRadius: '0.25rem',
  borderEndStartRadius: '0.25rem',

  overflow: 'hidden',
});

export const swatchColor = createVar('color');
export const swatchTextColor = createVar('text-color');
export const swatchColorStyle = style({
  background: swatchColor,
  color: swatchTextColor,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'column nowrap',

  paddingBlockStart: '2rem',
  paddingBlockEnd: '2rem',
  paddingInlineStart: '2rem',
  paddingInlineEnd: '2rem',
});

globalStyle(`${swatchColorStyle} span`, {
  background: 'inherit',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'invert(1) grayscale(1) contrast(100)',
});

globalStyle(`${swatchColorStyle} span:first-child`, {
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: '1.25em',
  paddingBlockEnd: '0.5rem',
  textAlign: 'left',
});
