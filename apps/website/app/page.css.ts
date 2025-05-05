import {
  style,
} from '@vanilla-extract/css';

export const landingPageWrapper = style({
  inlineSize: '100cqw',
  blockSize: '100cqh',
  position: 'relative',
  overflowInline: 'hidden',
  overflowBlock: 'auto',
  containerType: 'inline-size',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  paddingBlockStart: '5cqmin',
});
