import { theme } from '@sabinmarcu/theme';
import {
  createVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { navigationOffset } from './Navigation.css';
import { pageLayoutSize } from './PageLayout.css';

export const pageTOCLayoutTOCStyles = style({
  '@media': {
    // TODO: Figure out TOC for smaller screens
    [theme.breakpoint['lt-large']]: {
      display: 'none',
    },
    [theme.breakpoint['gte-large']]: {
      position: 'sticky',
      insetInline: 0,
      insetBlockStart: navigationOffset,
    },
  },
});

const tocSize = createVar();
const availableTocSpace = createVar();
const preferredTocSize = createVar();
globalStyle(`${pageTOCLayoutTOCStyles} section`, {
  '@media': {
    [theme.breakpoint['gte-large']]: {
      maxInlineSize: tocSize,
      inlineSize: tocSize,

      position: 'sticky',

      insetInlineStart: `calc(100cqw / 2 - ${pageLayoutSize} / 2 - ${tocSize})`,

      vars: {
        [availableTocSpace]: `calc(100cqw / 2 - ${pageLayoutSize} / 2)`,
        [preferredTocSize]: `calc(${pageLayoutSize} / 3)`,
        [tocSize]: `min(${preferredTocSize}, ${availableTocSpace})`,
      },
    },
  },

});

const tocMargin = createVar();
const tocPadding = createVar();
// eslint-disable-next-line logical-properties/overflow
globalStyle(`${pageTOCLayoutTOCStyles} nav`, {
  paddingBlock: tocPadding,
  paddingInline: tocPadding,

  marginInline: tocMargin,

  position: 'absolute',

  insetBlockStart: tocMargin,
  insetInline: 0,

  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  borderInlineStart: `solid 1px ${theme.colors.primary.muted}`,
  borderInlineEnd: `solid 1px ${theme.colors.primary.muted}`,
  borderBlockStart: `solid 1px ${theme.colors.primary.muted}`,
  borderBlockEnd: `solid 1px ${theme.colors.primary.muted}`,

  maxBlockSize: `calc(100cqh - ${navigationOffset} - ${tocMargin} * 2)`,

  overflowX: 'hidden',
  overflowY: 'auto',

  fontSize: theme.grid.l,
  background: theme.colors.background.depressed,

  vars: {
    [tocMargin]: theme.grid.xxl,
    [tocPadding]: theme.grid.m,
  },
});

globalStyle(`${pageTOCLayoutTOCStyles} h1`, {
  fontSize: theme.grid.xxl,
  borderBlockEnd: `solid 1px ${theme.colors.primary.muted}`,
  background: theme.colors.background.depressed,
  marginBlockEnd: theme.grid.m,
  paddingBlockEnd: theme.grid.xxs,
  position: 'sticky',
  insetInline: `calc(0px - ${tocPadding})`,
  insetBlockStart: `calc(0px - ${tocPadding})`,
  marginBlockStart: `calc(0px - ${tocPadding})`,
  paddingBlockStart: tocPadding,
});

globalStyle(`${pageTOCLayoutTOCStyles} ul ul`, {
  paddingInlineStart: tocPadding,
});

globalStyle(`${pageTOCLayoutTOCStyles} li`, {
  listStyle: 'none',
});
